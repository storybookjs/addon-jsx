import React from 'react';
import { ActionBar, SyntaxHighlighter } from '@storybook/components';
import { styled } from '@storybook/theming';
import copy from 'copy-to-clipboard';

import { Listener } from './register';
import jsxRenderer, { ComponentMap } from './renderer';

const Container = styled.div(({ theme }) => ({
  padding: theme.layoutMargin
}));

interface JSXProps {
  active: boolean;
  ob(listener: Listener): void;
}

const JSX: React.FunctionComponent<JSXProps> = props => {
  const [current, setCurrent] = React.useState<string | undefined>(undefined);
  const [jsx, setJsx] = React.useState<Record<string, [string, ComponentMap]>>(
    {}
  );

  const addJsx = (id: string, newJsx: string, components: ComponentMap) =>
    setJsx({ ...jsx, [id]: [newJsx, components] });

  React.useEffect(() => {
    props.ob({
      next: type => (type === 'jsx' ? addJsx : setCurrent)
    });
  }, []);

  const [code, components] = current && jsx[current] ? jsx[current] : [''];

  const copyJsx = React.useCallback(() => copy(code), [code]);

  return props.active ? (
    <Container>
      <SyntaxHighlighter
        language="jsx"
        format={false}
        renderer={jsxRenderer(components)}
        wrapLines={false}
      >
        {code}
      </SyntaxHighlighter>
      <ActionBar
        actionItems={[
          {
            title: 'Copy',
            onClick: copyJsx
          }
        ]}
      />
    </Container>
  ) : null;
};

export default JSX;
