import React from 'react'
import { setAddon, storiesOf } from '@kadira/storybook'
import JSXAddon from '../../lib/index'

setAddon(JSXAddon)

class ControlledWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: props.defaultValue }
  }
  render() {
    return this.props.children(this.state.value, (name, newValue) =>
      this.setState({ value: newValue }),
    )
  }
}
const withErrors = BaseComponent => props => {
  const { name, errors, showErrors, ...baseProps } = props
  let childErrors = null
  if (showErrors && errors) {
    const correspondingErrors = errors.filter(error => error.field === name)
    if (correspondingErrors.length > 0) childErrors = correspondingErrors
  }
  return <BaseComponent {...baseProps} name={name} errors={childErrors} />
}

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

class NumberPicker extends React.Component {
  render() {
    return <div />
  }
}
// const NumberPicker = ({ name, value, onChange }) => <div />
const NumberWithError = withErrors(NumberPicker)

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
      {() => <span>Hola</span>}
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

storiesOf('Number Picker', module).addWithJSX(
  'Base',
  () => (
    <ControlledWrapper defaultValue={0}>
      {(value, onChange) => (
        <NumberWithError
          name="testnumber"
          value={value}
          onChange={onChange}
          errors={[]}
          showErrors={() => {}}
        />
      )}
    </ControlledWrapper>
  ),
  { skip: 0 },
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
