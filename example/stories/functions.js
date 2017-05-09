import React from 'react'
import { storiesOf } from '@kadira/storybook'

class Simple extends React.Component {
  render() {
    return (
      <div>
        {typeof this.props.children === 'function'
          ? this.props.children()
          : this.props.children}
      </div>
    )
  }
}
const withErrors = BaseComponent => props => {
  const style = { color: 'red' }
  return <BaseComponent {...props} style={style} />
}
const SimpleWithErrors = withErrors(Simple)

export default () =>
  storiesOf('Function as a children', module)
    .addWithJSX('No options', () => (
      <Simple>
        {() => <span>World</span>}
      </Simple>
    ))
    .addWithJSX(
      'Skip',
      () => (
        <Simple>
          {() => <span>World</span>}
        </Simple>
      ),
      { skip: 1 },
    )
    .addWithJSX(
      'Skip and Rename',
      () => (
        <Simple>
          {() => <span>World</span>}
        </Simple>
      ),
      { skip: 1, displayName: () => 'Renamed' },
    )
    .addWithJSX('Deep function - No options', () => (
      <div>
        {() => (
          <SimpleWithErrors>
            <span>World</span>
          </SimpleWithErrors>
        )}
      </div>
    ))
    .addWithJSX(
      'Deep function - Skip',
      () => (
        <div>
          {() => (
            <SimpleWithErrors>
              <span>World</span>
            </SimpleWithErrors>
          )}
        </div>
      ),
      { skip: 2 },
    )
