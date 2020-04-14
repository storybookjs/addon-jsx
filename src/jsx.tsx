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
  /** Whether the panel is active */
  active: boolean;
  ob(listener: Listener): void;
}

/** The panel that renders the jsx for the story */
const JSX = ({ ob, active }: JSXProps) => {
  const [current, setCurrent] = React.useState<string | undefined>(undefined);
  const [jsx, setJsx] = React.useState<Record<string, [string, ComponentMap]>>(
    {}
  );

  React.useEffect(() => {
    ob({
      next: type => {
        if (type === 'jsx') {
          return (id: string, newJsx: string, components: ComponentMap) =>
            setJsx({ ...jsx, [id]: [newJsx, components] });
        }

        return setCurrent;
      }
    });
  }, []);

  const [code, components] = current && jsx[current] ? jsx[current] : ['', {}];

  const copyJsx = React.useCallback(() => copy(code), [code]);

  return active ? (
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
