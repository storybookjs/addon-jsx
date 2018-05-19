import React from 'react';
import { storiesOf } from '@storybook/react';

const Simple = ({ children }) => (
  <div>
    <span>Hello</span>
    {children}
  </div>
);

export default () =>
  storiesOf('With Props', module)
    .addWithJSX('No children - No options', () => (
      <Simple test="test" value={true} />
    ))
    .addWithJSX(
      'No children - Rename',
      () => <Simple test="test" value={true} />,
      {
        displayName: 'Renamed',
      },
    )
    .addWithJSX('With children - No options', () => (
      <Simple test="test" value={true}>
        <span>World</span>
      </Simple>
    ))
    .addWithJSX(
      'With children - Skip',
      () => (
        <Simple>
          <Simple test="test" value={true}>
            <div />
          </Simple>
        </Simple>
      ),
      { skip: 1 },
    )
    .addWithJSX(
      'With children - Skip and rename',
      () => (
        <Simple>
          <Simple test="test" value={true}>
            <span>World</span>
          </Simple>
        </Simple>
      ),
      { skip: 1, displayName: () => 'Renamed' },
    )
    .addWithJSX(
      'With dangerouslySetInnerHTML - onBeforeRender',
      () => (
        <Simple>
          <Simple test="test" value={true}>
            <div dangerouslySetInnerHTML={{ __html: '<div>Inner HTML<ul><li>1</li><li>2</li></ul></div>',}} />
          </Simple>
        </Simple>
      ),
      {
        skip: 1,
        onBeforeRender: domString => {
          if (domString.search('dangerouslySetInnerHTML') < 0) {
            return ''
          }
          try {
            domString = /(dangerouslySetInnerHTML={{)([^}}]*)/.exec(domString)[2]
            domString = /(')([^']*)/.exec(domString)[2]
          } catch (err) {}
          return domString
        },
      },
    );
