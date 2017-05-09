import React from 'react'
import addons from '@kadira/storybook-addons'
import reactElementToJSXString from 'react-element-to-jsx-string'

export default {
  addWithJSX(kind, story, opts = {}) {
    const defaultOpts = {
      skip: 0,
      showFunctions: true,
    }
    const channel = addons.getChannel()
    const result = this.add(kind, story)
    const options = Object.assign({}, defaultOpts, opts)
    let code = story()

    for (let i = 0; i < options.skip; i++) {
      if (typeof code === 'undefined') {
        console.warn('Cannot skip undefined element')
        return
      }

      if (React.Children.count(code) > 1) {
        console.warn('Trying to skip an array of elements')
        return
      }

      if (typeof code.props.children === 'undefined') {
        console.warn('Not enough children to skip elements.')

        if (typeof code.type === 'function' && code.type.name === '')
          code = code.type(code.props)
      } else {
        if (typeof code.props.children === 'function') {
          code = code.props.children()
        } else {
          code = code.props.children
        }
      }
    }

    if (typeof code === 'undefined')
      return console.warn('Too many skip or undefined component')

    while (typeof code.type === 'function' && code.type.name === '')
      code = code.type(code.props)

    const ooo = typeof options.displayName === 'string'
      ? Object.assign({}, options, { displayName: () => options.displayName })
      : options

    const compiledCode = React.Children
      .map(code, c => reactElementToJSXString(c, ooo))
      .join('\n')

    channel.emit('kadira/jsx/add_jsx', result.kind, kind, compiledCode)
    return result
  },
}
