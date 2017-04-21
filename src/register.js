import React, { Component } from 'react'
import addons from '@kadira/storybook-addons'
import Prism from 'prismjs'

require('prismjs/themes/prism.css')

export class JSX extends Component {
  constructor(...args) {
    super(...args)

    this.state = {}
    this.onAddJSX = this.onAddJSX.bind(this)
    this.stopListeningOnStory = () => this.setState({})
  }

  componentDidMount() {
    const { channel, api } = this.props

    channel.on('kadira/jsx/add_jsx', this.onAddJSX)
    api.onStory(this.setCurrent.bind(this))
  }

  componentWillUnmount() {
    const { channel } = this.props

    if (this.stopListeningOnStory) {
      this.stopListeningOnStory()
    }
    channel.removeListener('kadira/jsx/add_jsx', this.onAddJSX)
  }

  setCurrent(kind, story) {
    this.setState({ current: { kind, story } })
  }

  onAddJSX(kind, story, jsx) {
    const state = this.state

    if (typeof state[kind] === 'undefined') {
      state[kind] = {}
    }
    state[kind][story] = jsx
    this.setState(state)
  }

  render() {
    if (
      typeof this.state.current !== 'undefined' &&
      typeof this.state[this.state.current.kind] !== 'undefined'
    ) {
      const current = this.state.current
      const code = this.state[current.kind][current.story]
      const jsx = Prism.highlight(code, Prism.languages.html)

      return (
        <pre style={styles.pre} dangerouslySetInnerHTML={{ __html: jsx }} />
      )
    } else {
      return <div style={styles.pre} />
    }
  }
}
addons.register('kadira/jsx', api => {
  addons.addPanel('kadira/jsx/panel', {
    title: 'JSX',
    render: () => <JSX channel={addons.getChannel()} api={api} />,
  })
})

const styles = {
  pre: {
    padding: '5px 15px',
  },
}
