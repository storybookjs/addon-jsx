import React from 'react';
import { storiesOf } from '@storybook/react';
import { jsxDecorator } from '../../lib/index';

const Component = () => <div />;
const Simple = props => (
  <div>
    <span>Hello</span>
    {props.children}
  </div>
);

storiesOf('Decorator', module)
  .addDecorator(jsxDecorator)
  .addWithJSX(
    'Simple Array',
    () => (
      <div>
        <div />
        <div />
      </div>
    ),
    { skip: 1 }
  )
  .addWithJSX(
    'Array with function',
    () => (
      <div>
        <div />
        <div />
        {Component()}
      </div>
    ),
    { skip: 1 }
  )
  .addWithJSX(
    'Array with nested component',
    () => (
      <div>
        <div />
        <Simple>
          <span>hello</span>
        </Simple>
      </div>
    ),
    { skip: 1 }
  );
