import React, { ComponentProps } from 'react';
import { WithTooltip, TooltipMessage } from '@storybook/components';
import PrettyPropType from 'storybook-pretty-props';

type StyleSheet = Record<string, React.CSSProperties>;
export type ComponentMap = Record<
  string,
  {
    description?: string;
    displayName: string;
    children: (Node | string)[];
    props?: Record<
      string,
      {
        required?: boolean;
        description?: string;
        type: ComponentProps<typeof PrettyPropType>['propType'];
      }
    >;
  }
>;

function createStyleObject(
  classNames: string[],
  elementStyle = {},
  stylesheet: StyleSheet
) {
  return classNames.reduce((styleObject, className) => {
    return { ...styleObject, ...stylesheet[className] };
  }, elementStyle);
}

function createClassNameString(classNames: string[]) {
  return classNames.join(' ');
}

interface Node {
  type: string;
  tagName: string;
  properties: {
    className: string[];
    style?: React.CSSProperties;
  };
  children: React.ReactNode;
  value?: string;
}

function createChildren(
  components: ComponentMap,
  stylesheet?: StyleSheet,
  useInlineStyles?: boolean
) {
  let childrenCount = 0;

  return (children: Node[]) => {
    childrenCount += 1;

    return children.map((child, i) =>
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
  node: Node;
  key: string;
  stylesheet?: StyleSheet;
  components: ComponentMap;
  useInlineStyles?: boolean;
  style?: React.CSSProperties;
}

let lastComponent = '';

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
  } else if (tagName) {
    const TagName = tagName as any;
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
            Object.assign({}, properties.style, style),
            stylesheet
          )
        }
      : {
          ...properties,
          className: createClassNameString(properties.className)
        };
    const children = childrenCreator(node.children as Node[]);

    const name = typeof children[0] === 'string' ? children[0] : '';
    const hasDocs =
      props.className.includes('class-name') ||
      props.className.includes('attr-name');

    if (hasDocs) {
      let message;
      let title;

      if (props.className.includes('class-name')) {
        const docs = components[name] || {};

        title = children;
        message = <div>{docs.description}</div>;
      } else {
        const { props = {} } = components[lastComponent] || {};
        const docs = props[name] || {};

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
            {docs.description}
          </div>
        );
      }

      if (props.className.includes('class-name')) {
        lastComponent = name;
      }

      return (
        <WithTooltip
          placement="bottom"
          trigger="hover"
          tooltip={<TooltipMessage title={title} desc={message} />}
        >
          <TagName key={key} {...props}>
            {children}
          </TagName>
        </WithTooltip>
      );
    }

    return (
      <TagName key={key} {...props}>
        {children}
      </TagName>
    );
  }
}

interface RenderRows {
  rows: Node[];
  stylesheet: StyleSheet;
  useInlineStyles?: boolean;
}

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
