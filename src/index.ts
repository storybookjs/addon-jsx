import React from 'react';
import { addons } from '@storybook/addons';
import { RenderFunction, Story } from '@storybook/react';
import reactElementToJSXString, { Options } from 'react-element-to-jsx-string';
import { html as beautifyHTML } from 'js-beautify';

import { EVENTS } from './constants';

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

  return React.Children.map(code, c =>
    applyBeforeRender(reactElementToJSXString(c, ooo as Options), options)
  ).join('\n');
};

interface JSXParameters {
  id: string;
  jsx?: JSXOptions;
}

const jsxDecorator = function(
  this: Story,
  storyFn: RenderFunction,
  parameters: JSXParameters
) {
  const defaultOpts = {
    skip: 0,
    showFunctions: true,
    enableBeautify: true
  };
  const options = {
    ...defaultOpts,
    ...(parameters.jsx || {})
  } as Required<JSXOptions>;
  const channel = addons.getChannel();

  const story: ReturnType<typeof storyFn> & {
    template?: string;
  } = storyFn();
  let jsx = '';

  // Template doesn't exits on react component?
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

  return story;
};

export default jsxDecorator;
