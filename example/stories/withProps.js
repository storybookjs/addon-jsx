import React from 'react'
import { storiesOf } from '@storybook/react'

const Simple = ({ children }) => (
  <div><span>Hello</span>{children ? () => <div>chidren</div> : null}</div>
)

export default () =>
  storiesOf('With Props', module)
    .addWithJSX('No children - No options', () => <Simple test="test" value={true} />)
    .addWithJSX('No children - Rename', () => <Simple test="test" value={true} />, {
      displayName: 'Renamed',
    })
    .addWithJSX('With children - No options', () => (
      <Simple test="test" value={true}>
        <span>World</span>
      </Simple>
    ))
    .addWithJSX(
      'With children - Skip',
      () => (
        <Simple>
          <Simple test="test" value={true}>
            <div />
          </Simple>
        </Simple>
      ),
      { skip: 1 },
    )
    .addWithJSX(
      'With children - Skip and rename',
      () => (
        <Simple>
          <Simple test="test" value={true}>
            <span>World</span>
          </Simple>
        </Simple>
      ),
      { skip: 1, displayName: () => 'Renamed' },
    )
