import React from 'react'
import { storiesOf } from '@kadira/storybook'

const Deep = ({ children }) => (
  <div>
    <div>
      <div>
        <div>
          <span>Hello</span>
          {children ? children : null}
        </div>
      </div>
    </div>
  </div>
)

export default () =>
  storiesOf('Deep Test', module)
    .addWithJSX('No children - No options', () => (
      <div>
        <div>
          <ul>
            <li>Deeper</li>
          </ul>
          <div>
            <div>
              <span>Hello</span>
              <Deep />
            </div>
          </div>
        </div>
      </div>
    ))
    .addWithJSX(
      'No children - Rename',
      () => (
        <div>
          <div>
            <div>
              <div>
                <span>Hello</span>
                <Deep />
              </div>
            </div>
          </div>
        </div>
      ),
      {
        displayName: 'Renamed',
      },
    )
    .addWithJSX('With children - No options', () => (
      <div>
        <div>
          <div>
            <div>
              <span>Hello</span>
              <Deep />
            </div>
          </div>
        </div>
      </div>
    ))
    .addWithJSX(
      'With children - Skip',
      () => (
        <div>
          <div>
            <div>
              <div>
                <span>Hello</span>
                <Deep />
              </div>
            </div>
          </div>
        </div>
      ),
      { skip: 1 },
    )
    .addWithJSX(
      'With children - Skip and rename',
      () => (
        <div>
          <div>
            <ul>
              <li>Deeper</li>
            </ul>
            <div>
              <div>
                <span>Hello</span>
                <Deep />
              </div>
            </div>
          </div>
        </div>
      ),
      { skip: 1, displayName: 'Renamed' },
    )
