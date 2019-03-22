import React from 'react';
import { ActionBar } from '@storybook/components';
import { styled } from '@storybook/theming';
import copy from 'copy-to-clipboard';
import Theme from './theme';
import Prism from './prism';
import { Listener } from './register';

const Container = styled.div({
  height: '100%',
  overflow: 'auto',
  width: '100%'
});

const Code = styled.pre({
  flex: 1
});

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

  let code = '';
  let highlighted = '';

  if (current && jsx[current]) {
    code = jsx[current];
    highlighted = code ? Prism.highlight(code, Prism.languages.jsx) : '';
  }

  const copyJsx = React.useCallback(() => copy(code), [code]);

  return props.active ? (
    <Container>
      <Theme>
        <Code dangerouslySetInnerHTML={{ __html: highlighted }} />
        <ActionBar
          actionItems={[
            {
              title: 'Copy',
              onClick: copyJsx
            }
          ]}
        />
      </Theme>
    </Container>
  ) : null;
};

export default JSX;
