import React from 'react'
import { storiesOf } from '@kadira/storybook'

const Component = () => <div />

export default () =>
  storiesOf('Children Array', module).addWithJSX(
    'Simple Array',
    () => (
      <div>
        <div />
        <div />
      </div>
    ),
    { skip: 1 },
  )
