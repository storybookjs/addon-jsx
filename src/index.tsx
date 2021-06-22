/* eslint-disable no-underscore-dangle, @typescript-eslint/no-explicit-any */

import React from 'react';
import {
  addons,
  makeDecorator,
  StoryContext,
  StoryFn,
  StoryApi,
  ClientStoryApi
} from '@storybook/addons';
import reactElementToJSXString, { Options } from 'react-element-to-jsx-string';
import { html as beautifyHTML } from 'js-beautify';

import { EVENTS } from './constants';
import { ComponentMap } from './renderer';

export declare const addDecorator: ClientStoryApi<any>['addDecorator'];
export declare type DecoratorFn = Parameters<typeof addDecorator>[0];

type VueComponent = {
  /** The template for the Vue component */
  template?: string;
};

interface JSXOptions extends HTMLBeautifyOptions {
  /** How many wrappers to skip when rendering the jsx */
  skip?: number;
  /** Whether to show the function in the jsx tab */
  showFunctions?: boolean;
  /** Whether to format HTML or Vue markup */
  enableBeautify?: boolean;
  /** Override the display name used for a component */
  displayName?: string | Options['displayName'];
  /** A function ran before the story is rendered */
  onBeforeRender?(dom: string): string;
  displayName?: string | Options['displayName'];
  /** 
   * - If an array of strings is passed, filter out any prop who's name is in the array. For example ['key'] will suppress the key="" prop from being added.
   * - If a function is passed, it will be called for each prop with two arguments, the prop value and key, and will filter out any that return false. 
   **/
  filterProps?: string[] | (val: any, key: string) => boolean, default val => val !== undefined;
}

/** Run the user supplied onBeforeRender function if it exists */
const applyBeforeRender = (domString: string, options: JSXOptions) => {
  if (typeof options.onBeforeRender !== 'function') {
    return domString;
  }

  return options.onBeforeRender(domString);
};

/** Apply the users parameters and render the jsx for a story */
const renderJsx = (code: React.ReactElement, options: Required<JSXOptions>) => {
  let renderedJSX = code;
  let Type = renderedJSX.type;

  for (let i = 0; i < options.skip; i++) {
    if (typeof renderedJSX === 'undefined') {
      // eslint-disable-next-line no-console
      console.warn('Cannot skip undefined element');
      return;
    }

    if (React.Children.count(renderedJSX) > 1) {
      // eslint-disable-next-line no-console
      console.warn('Trying to skip an array of elements');
      return;
    }

    if (typeof renderedJSX.props.children === 'undefined') {
      // eslint-disable-next-line no-console
      console.warn('Not enough children to skip elements.');

      if (typeof Type === 'function' && Type.name === '') {
        renderedJSX = <Type {...renderedJSX.props} />;
      }
    } else if (typeof renderedJSX.props.children === 'function') {
      renderedJSX = renderedJSX.props.children();
    } else {
      renderedJSX = renderedJSX.props.children;
    }
  }

  if (typeof renderedJSX === 'undefined') {
    // eslint-disable-next-line no-console
    return console.warn('Too many skip or undefined component');
  }

  while (typeof Type === 'function' && Type.name === '') {
    renderedJSX = <Type {...renderedJSX.props} />;
    Type = renderedJSX.type;
  }

  const ooo =
    typeof options.displayName === 'string'
      ? {
          ...options,
          showFunctions: true,
          displayName: () => options.displayName
        }
      : options;

  return React.Children.map(renderedJSX, c => {
    let string = applyBeforeRender(
      reactElementToJSXString(c, ooo as Options),
      options
    );
    const matches = string.match(/\S+=\\"([^"]*)\\"/g);

    if (matches) {
      matches.forEach(match => {
        string = string.replace(match, match.replace(/&quot;/g, "'"));
      });
    }

    return string;
  }).join('\n');
};

/** Extract the docs for all components used in a story */
const getDocs = (story: React.ReactElement) => {
  const types: ComponentMap = {};

  /** Walk the story for components */
  function extract(innerChildren: React.ReactElement) {
    if (!innerChildren) {
      return;
    }

    if (Array.isArray(innerChildren)) {
      innerChildren.forEach(extract);
      return;
    }

    if (innerChildren.props && innerChildren.props.children) {
      extract(innerChildren.props.children);
    }

    Object.values(innerChildren.props || {}).forEach(prop => {
      extract(prop as React.ReactElement);
    });

    if (typeof innerChildren.type !== 'string' && innerChildren.type) {
      const childType = innerChildren.type as any;
      const name: string = childType.displayName || childType.name;

      if (name && !types[name]) {
        types[name] = childType.__docgenInfo;
      }
    }
  }

  extract(story);

  return types;
};

const defaultOpts = {
  skip: 0,
  showDefaultProps: true,
  showFunctions: true,
  enableBeautify: true,
  filterProps: val => val !== undefined
};

/** Extract components from story and emit them to the panel */
export const jsxDecorator = makeDecorator({
  name: 'jsx',
  parameterName: 'jsx',
  wrapper: (storyFn: any, parameters: StoryContext) => {
    const story: ReturnType<typeof storyFn> & VueComponent = storyFn();

    const channel = addons.getChannel();

    const options = {
      ...defaultOpts,
      ...((parameters && parameters.parameters.jsx) || {})
    } as Required<JSXOptions>;

    let components: ComponentMap = {};
    let jsx = '';

    if (story.template) {
      if (options.enableBeautify) {
        jsx = beautifyHTML(story.template, options);
      } else {
        jsx = story.template;
      }
    } else {
      const rendered = renderJsx(story, options);

      if (rendered) {
        jsx = rendered;
        components = getDocs(story);
      }
    }

    channel.emit(EVENTS.ADD_JSX, (parameters || {}).id, jsx, components);

    return story;
  }
});

export default {
  addWithJSX(this: StoryApi, kind: string, storyFn: StoryFn<any>) {
    return this.add(kind, context => jsxDecorator(storyFn, context));
  }
};
