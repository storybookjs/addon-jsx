import React from 'react';
import addons from '@storybook/addons';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { html as beautifyHTML } from 'js-beautify';

const applyBeforeRender = (domString, options) => {
  if (typeof options.onBeforeRender !== 'function') {
    return domString;
  }
  return options.onBeforeRender(domString);
};

const renderJsx = (code, options) => {
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

      if (typeof code.type === 'function' && code.type.name === '')
        code = code.type(code.props);
    } else {
      if (typeof code.props.children === 'function') {
        code = code.props.children();
      } else {
        code = code.props.children;
      }
    }
  }

  if (typeof code === 'undefined')
    return console.warn('Too many skip or undefined component');

  while (typeof code.type === 'function' && code.type.name === '')
    code = code.type(code.props);

  const ooo =
    typeof options.displayName === 'string'
      ? Object.assign({}, options, {
          showFunctions: true,
          displayName: () => options.displayName
        })
      : options;

  return React.Children.map(code, c =>
    applyBeforeRender(reactElementToJSXString(c, ooo), options)
  ).join('\n');
};

export default {
  addWithJSX(kind, storyFn, opts = {}) {
    const defaultOpts = {
      skip: 0,
      showFunctions: true,
      enableBeautify: true
    };
    const options = Object.assign({}, defaultOpts, opts);
    const channel = addons.getChannel();

    const result = this.add(kind, context => {
      const story = storyFn(context);
      let jsx = '';

      if (story.template) {
        if (options.enableBeautify) {
          jsx = beautifyHTML(story.template, options);
        } else {
          jsx = story.template;
        }
      } else {
        jsx = renderJsx(story, options);
      }

      channel.emit('kadira/jsx/add_jsx', context.id, jsx);

      return story;
    });

    return result;
  }
};
