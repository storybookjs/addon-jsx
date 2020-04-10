import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';

/** A simple component */
export const Simple = ({ children }) => (
  <div>
    <span>Hello</span>
    {children}
  </div>
);

Simple.propTypes = {
  /** A test string */
  foo: PropTypes.string.isRequired,
  /** A test string */
  test: PropTypes.string,
  /** A test boolean */
  value: PropTypes.bool
};

Simple.defaultProps = {
  value: false
};

export default Simple;
