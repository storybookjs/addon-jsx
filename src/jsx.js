import React, { Component } from 'react'
import Prism from './prism.min'

import globalStyle from './css'

const prismStyle = document.createElement('style')
prismStyle.innerHTML = globalStyle
document.body.appendChild(prismStyle)

export default class JSX extends Component {
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
      const jsx = code ? Prism.highlight(code, Prism.languages.jsx) : ''

      return (
        <pre style={styles.pre} dangerouslySetInnerHTML={{ __html: jsx }} />
      )
    } else {
      return <pre style={styles.pre} />
    }
  }
}

const styles = {
  pre: {
    flex: 1,
    padding: '5px 15px',
  },
}
