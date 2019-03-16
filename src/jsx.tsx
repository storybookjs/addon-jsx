import React, { CSSProperties } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import Prism from './prism';
import { Listener } from './register';

const styles: Record<string, CSSProperties> = {
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

interface JSXProps {
  active: boolean;
  ob(listener: Listener): void;
}

const JSX: React.FunctionComponent<JSXProps> = props => {
  const [current, setCurrent] = React.useState<string | undefined>(undefined);
  const [jsx, setJsx] = React.useState<Record<string, string>>({});

  const addJsx = (id: string, newJsx: string) =>
    setJsx({ ...jsx, [id]: newJsx });

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
      <CopyToClipboard text={code}>
        <button style={styles.btn} disabled={!code}>
          Copy
        </button>
      </CopyToClipboard>
      <pre
        style={styles.pre}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  );
};

export default JSX;
