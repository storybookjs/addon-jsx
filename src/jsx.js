import React, { Component } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Prism from './prism'

import globalStyle from './css'

const prismStyle = document.createElement('style')
prismStyle.innerHTML = globalStyle
document.body.appendChild(prismStyle)

export default class JSX extends Component {
  constructor(props, ...args) {
    super(props, ...args)
    props.ob({
      next: type => (type === 'jsx' ? this.onAddJSX.bind(this) : this.setCurrent.bind(this)),
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
        <div style={styles.container}>
          <CopyToClipboard style={styles.btn} text={code ? code : ''}>
            <button>Copy</button>
          </CopyToClipboard>
          <pre style={styles.pre} dangerouslySetInnerHTML={{ __html: jsx }} />
        </div>
      )
    } else {
      return (
        <div style={styles.container}>
          <CopyToClipboard style={styles.btn} text="" disabled>
            <button>Copy</button>
          </CopyToClipboard>
          <pre style={styles.pre} />
        </div>
      )
    }
  }
}

const styles = {
  container: {
    flex: 1,
    padding: '10px',
  },
  btn: {
    width: '100%',
    outline: 'none',
    border: '1px solid #A7A7A7',
    borderRadius: 2,
    color: '#A7A7A7',
    padding: 2,
    margin: 0,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all .3s ease',
    textTransform: 'uppercase',
  },
  pre: {
    flex: 1,
  },
}
