import React from 'react'
import toJSX from 'jsx-to-string'
import addons from '@kadira/storybook-addons'

export default {
  addWithJSX(kind, story) {
    const channel = addons.getChannel()
    const result = this.add(kind, story)

    channel.emit('kadira/jsx/add_jsx', result.kind, kind, toJSX(story()))
    return result
  },
}
