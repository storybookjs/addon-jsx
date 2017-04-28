import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

class Title extends Component {
  constructor(props, ...args) {
    super(props, ...args);
    props.ob({
      next: type => (type === 'jsx' ? this.onAddJSX.bind(this) : this.setCurrent.bind(this)),
    });

    this.state = {};
    this.stopListeningOnStory = () => this.setState({});
  }

  setCurrent(kind, story) {
    this.setState({ current: { kind, story } });
  }

  onAddJSX(kind, story, jsx) {
    const state = this.state;

    if (typeof state[kind] === 'undefined') {
      state[kind] = {};
    }
    state[kind][story] = jsx;
    this.setState(state);
  }
  _copy() {
    if (
      typeof this.state.current !== 'undefined' &&
      typeof this.state[this.state.current.kind] !== 'undefined'
    ) {
      Copy.copy(this.state[current.kind][current.story]);
    }
  }
  render() {
    if (
      typeof this.state.current !== 'undefined' &&
      typeof this.state[this.state.current.kind] !== 'undefined'
    ) {
      const current = this.state.current;
      const code = this.state[current.kind][current.story];

      return (
        <div>
          <span style={styles.title}>JSX</span>
          <CopyToClipboard style={styles.btn} text={code ? code : ''}>
            <button>Copy</button>
          </CopyToClipboard>
        </div>
      );
    } else {
      return (
        <div>
          <span style={styles.title}>JSX</span>
          <CopyToClipboard style={styles.btn} text="" disabled>
            <button>Copy</button>
          </CopyToClipboard>
        </div>
      );
    }
  }
}

export default Title;

const styles = {
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
};
