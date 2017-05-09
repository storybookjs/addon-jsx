# storybook-addon-jsx

This Storybook addon show you the JSX of the story.
It can be usefull to see what props you set for example.

![Storybook Addon JSX Démo](screenshot.png)

## Getting started

` yarn add --dev storybook-addon-jsx `

Create a file called `addons.js` in your storybook config (default: `.storybook`) :

```javascript
import '@kadira/storybook/addons'
import 'storybook-addon-jsx/register'
```

Then use it when you write stories :

```javascript

import React from 'react'
import { setAddon, storiesOf } from '@kadira/storybook'
import JSXAddon from 'storybook-addon-jsx'

setAddon(JSXAddon)

const Test = ({ fontSize = '16px', fontFamily = 'Arial', align = 'left', color = 'red', children }) => (
  <div style={{ color, fontFamily, fontSize, textAlign: align }}>
    {children}
  </div>
)

storiesOf('test', module)
  .addWithJSX('Paris', () => (
    <Test fontSize={45} fontFamily="Roboto" align="center" color="#CAF200">
      Hello
    </Test>
  ))
  .addWithJSX('Orleans', () => <Test color="#236544">Hello</Test>)

storiesOf('test 2', module).addWithJSX('Paris', () => (
  <div color="#333">test</div>
))
```

### OPTIONS

You can pass options as a third parameter.
Options available: 

- `skip` (default: 0) : Skip element in your component to display
- Options from [react-element-to-jsx-strin](https://github.com/algolia/react-element-to-jsx-string)

```javascript
// Option displayName
storiesOf('test 2', module).addWithJSX(
  'Paris',
  () => <TestContainer>Hello there</TestContainer>,
  { displayName: 'Test' }, // can be a function { displayName: element => 'Test' }
)
// Output
// <Test>Hello there</Test>
```

```javascript
//Option skip
storiesOf('test 2', module).addWithJSX(
  'Paris',
  () => (
    <div color="#333">
      <Test>Hello</Test>
    </div>
  ),
  { skip: 1 },
)
// Output
// <Test>Hello</Test>
```