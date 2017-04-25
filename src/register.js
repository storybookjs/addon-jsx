import React, { Component } from 'react'
import addons from '@kadira/storybook-addons'
import Prism from 'prismjs'
import CopyToClipboard from 'react-copy-to-clipboard'

import globalStyle from './css'

const prismStyle = document.createElement('style')
prismStyle.innerHTML = globalStyle
document.body.appendChild(prismStyle)

const Observable = (channel, api) => {
  return listener => {
    channel.on('kadira/jsx/add_jsx', listener.next('jsx'))
    api.onStory(listener.next('current'))
  }
}

export class JSX extends Component {
  constructor(props, ...args) {
    super(props, ...args)
    props.ob({
      next: type =>
        (type === 'jsx'
          ? this.onAddJSX.bind(this)
          : this.setCurrent.bind(this)),
    })

    this.state = {}
    this.stopListeningOnStory = () => this.setState({})
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
      return <pre style={styles.pre} />
    }
  }
}

class Title extends Component {
  constructor(props, ...args) {
    super(props, ...args)
    props.ob({
      next: type =>
        (type === 'jsx'
          ? this.onAddJSX.bind(this)
          : this.setCurrent.bind(this)),
    })

    this.state = {}
    this.stopListeningOnStory = () => this.setState({})
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
  _copy() {
    if (
      typeof this.state.current !== 'undefined' &&
      typeof this.state[this.state.current.kind] !== 'undefined'
    ) {
      Copy.copy(this.state[current.kind][current.story])
    }
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
        <div>
          <span style={styles.title}>JSX</span>
          <CopyToClipboard style={styles.btn} text={code}>
            <button>Copy</button>
          </CopyToClipboard>
        </div>
      )
    } else {
      return (
        <div>
          <span style={styles.title}>JSX</span>
          <CopyToClipboard style={styles.btn} text="" disabled>
            <button>Copy</button>
          </CopyToClipboard>
        </div>
      )
    }
  }
}
addons.register('kadira/jsx', api => {
  const ob = Observable(addons.getChannel(), api)

  addons.addPanel('kadira/jsx/panel', {
    title: <Title ob={ob} />,
    render: () => <JSX ob={ob} />,
  })
})

const styles = {
  pre: { flex: 1, padding: '5px 15px' },
  title: {
    marginRight: 8,
  },
  btn: {
    flex: 1,
    outline: 'none',
    border: '1px solid #A7A7A7',
    borderRadius: 2,
    color: '#A7A7A7',
    padding: 2,
    margin: 0,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all .3s ease',
  },
}
