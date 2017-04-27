import React from 'react'
import { setAddon, storiesOf } from '@kadira/storybook'
import JSXAddon from '../../lib/index'

setAddon(JSXAddon)

const Test = ({
  fontSize = '16px',
  fontFamily = 'Arial',
  align = 'left',
  color = 'red',
  children,
}) => (
  <div style={{ color, fontFamily, fontSize, textAlign: align }}>
    {children}
  </div>
)

storiesOf('test', module)
  .addWithJSX(
    'Paris',
    () => (
      <Test fontSize={45} fontFamily="Roboto" align="center" color="#CAF200">
        <Test onChange={() => console.log('test')} />
        <Test>Hello</Test>
      </Test>
    ),
    { displayName: 'Testeru' },
  )
  .addWithJSX('Orleans', () => (
    <Test align="test" font={['test', 't', 'test']} />
  ))
  .addWithJSX('Test fn', () => (
    <div>
      {() => <span>Hello</span>}
    </div>
  ))
  .addWithJSX(
    'Orleans',
    () => (
      <div>
        <div>
          {() => <span>Hello</span>}
        </div>
      </div>
    ),
    { skip: 2 },
  )

storiesOf('test 2', module).addWithJSX(
  'Paris',
  () => (
    <div color="#333">
      <Test>Hello</Test>
    </div>
  ),
  { skip: 1 },
)
