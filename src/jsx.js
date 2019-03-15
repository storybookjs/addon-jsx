import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import Prism from './prism';

const styles = {
  container: {
    flex: 1,
    padding: '10px',
    position: 'relative'
  },
  btn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    border: 'none',
    borderTop: 'solid 1px rgba(0, 0, 0, 0.2)',
    borderLeft: 'solid 1px rgba(0, 0, 0, 0.2)',
    background: 'rgba(255, 255, 255, 0.5)',
    padding: '5px 10px',
    borderRadius: '4px 0 0 0',
    color: 'rgba(0, 0, 0, 0.5)',
    textTransform: 'uppercase',
    outline: 'none',
    cursor: 'pointer'
  },
  pre: {
    flex: 1
  }
};

const JSX = props => {
  const [current, setCurrent] = React.useState(undefined);
  const [jsx, setJsx] = React.useState({});

  const addJsx = (id, newJsx) => setJsx({ ...jsx, [id]: newJsx });

  React.useEffect(() => {
    props.ob({
      next: type => (type === 'jsx' ? addJsx : setCurrent)
    });
  }, []);

  if (!props.active) {
    return null;
  }

  let code = '';
  let highlighted = '';

  if (current && jsx[current]) {
    code = jsx[current];
    highlighted = code ? Prism.highlight(code, Prism.languages.jsx) : '';
  }

  return (
    <div style={styles.container}>
      <CopyToClipboard style={styles.btn} text={code} disabled={!code}>
        <button>Copy</button>
      </CopyToClipboard>
      <pre
        style={styles.pre}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  );
};

export default JSX;
