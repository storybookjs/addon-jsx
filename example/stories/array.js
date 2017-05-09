import React from 'react'
import { storiesOf } from '@kadira/storybook'

const Component = () => <div />
const Simple = props => <div><span>Hello</span>{props.children}</div>

export default () =>
  storiesOf('Children Array', module)
    .addWithJSX(
      'Simple Array',
      () => (
        <div>
          <div />
          <div />
        </div>
      ),
      { skip: 1 },
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
      { skip: 1 },
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
      { skip: 1 },
    )
