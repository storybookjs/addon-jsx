import React from 'react';
import { addons, StoryContext, StoryFn } from '@storybook/addons';
import { DecoratorFn } from '@storybook/react';
import reactElementToJSXString, { Options } from 'react-element-to-jsx-string';
import { html as beautifyHTML } from 'js-beautify';

import { EVENTS } from './constants';

type VueComponent = {
  template?: string;
};

interface JSXOptions extends HTMLBeautifyOptions {
  skip?: number;
  showFunctions?: boolean;
  enableBeautify?: boolean;
  displayName?: string | Options['displayName'];
  onBeforeRender?(dom: string): string;
}

const applyBeforeRender = (domString: string, options: JSXOptions) => {
  if (typeof options.onBeforeRender !== 'function') {
    return domString;
  }

  return options.onBeforeRender(domString);
};

const renderJsx = (code: any, options: Required<JSXOptions>) => {
  for (let i = 0; i < options.skip; i++) {
    if (typeof code === 'undefined') {
      console.warn('Cannot skip undefined element');
      return;
    }

    if (React.Children.count(code) > 1) {
      console.warn('Trying to skip an array of elements');
      return;
    }

    if (typeof code.props.children === 'undefined') {
      console.warn('Not enough children to skip elements.');

      if (typeof code.type === 'function' && code.type.name === '') {
        code = code.type(code.props);
      }
    } else {
      if (typeof code.props.children === 'function') {
        code = code.props.children();
      } else {
        code = code.props.children;
      }
    }
  }

  if (typeof code === 'undefined') {
    return console.warn('Too many skip or undefined component');
  }

  while (typeof code.type === 'function' && code.type.name === '') {
    code = code.type(code.props);
  }

  const ooo =
    typeof options.displayName === 'string'
      ? {
        ...options,
        showFunctions: true,
        displayName: () => options.displayName
      }
      : options;

  return React.Children.map(code, c => {
    let string = applyBeforeRender(
      reactElementToJSXString(c, ooo as Options),
      options
    );
    const matches = string.match(/\S+=\"([^"]*)\"/g);

    if (matches) {
      matches.forEach(match => {
        string = string.replace(match, match.replace(/&quot;/g, "'"));
      });
    }

    return string;
  }).join('\n');
};

export const jsxDecorator: DecoratorFn = function (
  storyFn: StoryFn<React.ReactElement<unknown>>,
  parameters: StoryContext
) {
  const defaultOpts = {
    skip: 0,
    showFunctions: true,
    enableBeautify: true
  };
  const options = {
    ...defaultOpts,
    ...((parameters.parameters && parameters.parameters.jsx) || {})
  } as Required<JSXOptions>;
  const channel = addons.getChannel();

  const story: ReturnType<typeof storyFn> & VueComponent = storyFn();
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
    }
  }

  channel.emit(EVENTS.ADD_JSX, parameters.id, jsx);

  return <>{story}</>;
};

export default {
  addWithJSX(this: StoryFn, kind: string, storyFn: StoryFn, options: JSXOptions) {
    // @ts-ignore
    return this.add(kind, context => {
      const parameters = {
        ...context || {},
        parameters: {
          ...((context && context.parameters) || {}),
          jsx: {
            ...((context && context.parameters && context.parameters.jsx) || {}),
            ...options || {},
          },
        },
      } as StoryContext;

      return jsxDecorator(storyFn as StoryFn<React.ReactElement<unknown>>, parameters);
    });
  }
};
