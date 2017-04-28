import React from 'react';
import toJSX from './jsxtostring';
import addons from '@kadira/storybook-addons';

export default {
  addWithJSX(kind, story, opts = {}) {
    const defaultOpts = {
      skip: 0,
      useFunctionCode: true,
    };
    const channel = addons.getChannel();
    const result = this.add(kind, story);
    const options = Object.assign({}, defaultOpts, opts);
    let code = story();

    for (let i = 0; i < options.skip; i++) {
      if (typeof code === 'undefined') {
        console.warn('Cannot skip undefined element');
        return;
      }

      if (React.Children.count(code) > 1) {
        console.warn('Trying to skip more an array of elements');
        return;
      }

      if (typeof code.props.children === 'undefined') {
        console.warn('Not enough children to skip elements.');

        if (typeof code.type === 'function' && code.type.name === '') code = code.type(code.props);
      } else {
        if (typeof code.props.children === 'function') {
          code = code.props.children();
        } else {
          code = code.props.children;
        }
      }
    }

    if (typeof code === 'undefined') return console.warn('Too many skip or undefined component');

    while (typeof code.type === 'function' && code.type.name === '')
      code = code.type(code.props);

    const compiledCode = React.Children.map(code, code => toJSX(code, options)).join('\n');

    channel.emit('kadira/jsx/add_jsx', result.kind, kind, compiledCode);
    return result;
  },
};
