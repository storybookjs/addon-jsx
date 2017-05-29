import React, { Component } from 'react'
import addons from '@storybook/addons'

import Title from './title'
import JSX from './jsx'

const Observable = (channel, api) => {
  return listener => {
    channel.on('kadira/jsx/add_jsx', listener.next('jsx'))
    api.onStory(listener.next('current'))
  }
}

addons.register('kadira/jsx', api => {
  const ob = Observable(addons.getChannel(), api)

  addons.addPanel('kadira/jsx/panel', {
    title: <Title ob={ob} />,
    render: () => <JSX ob={ob} />,
  })
})
