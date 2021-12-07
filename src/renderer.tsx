import { TooltipMessage, WithTooltip } from '@storybook/components';
import Markdown from 'markdown-to-jsx';
import React, { ComponentProps } from 'react';
import PrettyPropType from 'storybook-pretty-props';

type StyleSheet = Record<string, React.CSSProperties>;
export type ComponentMap = Record<
  string,
  {
    /** The description of the component */
    description?: string;
    /** The display name of the component */
    displayName: string;
    /** The children of the component */
    children: (Node | string)[];
    /** The props of the component */
    props?: Record<
      string,
      {
        /** Whether the prop is required */
        required?: boolean;
        /** The description of the prop */
        description?: string;
        /** The type of the prop */
        type: ComponentProps<typeof PrettyPropType>['propType'];
      }
    >;
  }
>;

/** Combine the classnames and the stylesheet into a style prop */
function createStyleObject(
  classNames: string[],
  elementStyle: React.CSSProperties,
  stylesheet: StyleSheet
) {
  return classNames.reduce((styleObject, className) => {
    return { ...styleObject, ...stylesheet[className] };
  }, elementStyle);
}

/** Join and array of classnames into one */
function createClassNameString(classNames: string[]) {
  return classNames.join(' ');
}

interface Node {
  /** The type of node */
  type: string;
  /** The HTML tag to use to render the node */
  tagName: string;
  /** Properties of the HTML node to create */
  properties: {
    /** The classNames to put on the node */
    className: string[];
    /** The style object to put on the node */
    style?: React.CSSProperties;
  };
  /** The children of the HTML node to create */
  children: React.ReactNode;
  /** The value of the node to create */
  value?: string;
}

/** Render the rows of children to HTML nodes or text */
function createChildren(
  components: ComponentMap,
  stylesheet: StyleSheet,
  useInlineStyles?: boolean
) {
  let childrenCount = 0;

  return (children: Node[]) => {
    childrenCount += 1;

    return children.map((child, i) =>
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      createElement({
        node: child,
        stylesheet,
        useInlineStyles,
        components,
        key: `code-segment-${childrenCount}-${i}`
      })
    );
  };
}

interface CreateElementOptions {
  /** The node to create */
  node: Node;
  /** A react key to apply to the node */
  key: string;
  /** The stylesheet to use to style the highlighted output */
  stylesheet?: StyleSheet;
  /** A map of component used in the story and their docs */
  components: ComponentMap;
  /** Whether to inline all of the styles in the highlighted output */
  useInlineStyles?: boolean;
  /** The style object to put on the node */
  style?: React.CSSProperties;
}

const componentStack: string[] = [];

/** Transform a row of highlighted output into an HTML node */
function createElement({
  node,
  stylesheet = {},
  components,
  style = {},
  useInlineStyles,
  key
}: CreateElementOptions) {
  const { properties, type, tagName, value } = node;

  if (type === 'text') {
    return value;
  }

  if (tagName) {
    const TagName = tagName as keyof JSX.IntrinsicElements;
    const childrenCreator = createChildren(
      components,
      stylesheet,
      useInlineStyles
    );
    const nonStylesheetClassNames =
      useInlineStyles &&
      properties.className &&
      properties.className.filter(className => !stylesheet[className]);
    const className =
      nonStylesheetClassNames && nonStylesheetClassNames.length
        ? nonStylesheetClassNames
        : '';
    const props = useInlineStyles
      ? {
          ...properties,
          ...{
            className: className ? createClassNameString(className) : className
          },
          style: createStyleObject(
            properties.className,
            { ...properties.style, ...style },
            stylesheet
          )
        }
      : {
          ...properties,
          className: createClassNameString(properties.className)
        };
    const children = childrenCreator(node.children as Node[]);

    const lastComponent = componentStack[componentStack.length - 1] || '';
    const name = typeof children[0] === 'string' ? children[0] : '';
    const hasDocs =
      props.className.includes('class-name') ||
      props.className.includes('attr-name');

    if (hasDocs) {
      let message;
      let title;

      if (props.className.includes('class-name')) {
        const docs = components[name] || {};

        if (docs.description) {
          title = children;
          message = <Markdown>{docs.description}</Markdown>;
        }

        componentStack.push(name);
      } else if (lastComponent.match(/^[A-Z]/)) {
        const { props: componentProps = {} } = components[lastComponent] || {};
        const docs = componentProps[name] || {};

        if (docs.type || docs.description || docs.required) {
          title = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {children}
              {docs.required && (
                <div style={{ color: 'red', fontWeight: 900 }}>Required</div>
              )}
            </div>
          );
          message = (
            <div>
              <div style={{ color: 'green', fontWeight: 'bold' }}>
                <PrettyPropType propType={docs.type} />
              </div>
              <Markdown>{docs.description || ''}</Markdown>
            </div>
          );
        }
      }

      if (title) {
        return (
          <WithTooltip
            key={key}
            placement="bottom"
            trigger="hover"
            tooltip={<TooltipMessage title={title} desc={message} />}
          >
            <TagName {...props}>{children}</TagName>
          </WithTooltip>
        );
      }
    } else if (name === '/>' || name === '>') {
      componentStack.pop();
    }

    return (
      <TagName key={key} {...props}>
        {children}
      </TagName>
    );
  }
}

interface RenderRows {
  /** A row to render in the highlighted output */
  rows: Node[];
  /** The stylesheet to use to style the highlighted output */
  stylesheet: StyleSheet;
  /** Whether to inline all of the styles in the highlighted output */
  useInlineStyles?: boolean;
}

/** Render a row from the react-syntax-highlighter output */
const jsxRenderer = (components: ComponentMap) => ({
  rows,
  stylesheet,
  useInlineStyles
}: RenderRows) =>
  rows.map((node, i) =>
    createElement({
      node,
      stylesheet,
      useInlineStyles,
      components,
      key: `code-segement${i}`
    })
  );

export default jsxRenderer;
