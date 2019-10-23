import React from 'react';
import { storiesOf } from '@storybook/react';
import { jsxDecorator } from '../../lib/index';

storiesOf('Fragments', module)
  .addDecorator(jsxDecorator)
  .add('Simple Fragment', () => (
    <React.Fragment>
      <div />
      <div />
    </React.Fragment>
  ))
  .add('Array', () => [<div key="1" />, <div key="2" />])
  .add('Fragment Shorthand', () => (
    <>
      <div />
      <div />
    </>
  ));
