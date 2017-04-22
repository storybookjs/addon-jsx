import React from 'react'
import toJSX from 'jsx-to-string'
import addons from '@kadira/storybook-addons'

export default {
  addWithJSX(kind, story, opts = {}) {
    const defaultOpts = {
      skip: 0,
    }
    const channel = addons.getChannel()
    const result = this.add(kind, story)
    const options = Object.assign({}, defaultOpts, opts)

    let code = story()
    for (let i = 0; i < options.skip; i++) {
      if (typeof code.props.children === 'undefined') {
        console.warn('Not enough children to skip elements.')
        return code
      }
      code = code.props.children
    }

    channel.emit('kadira/jsx/add_jsx', result.kind, kind, toJSX(code, options))
    return result
  },
}
