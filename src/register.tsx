import React from 'react';
import { addons } from '@storybook/addons';
import { STORY_RENDERED } from '@storybook/core-events';
import Channel from '@storybook/channels';

import JSX from './jsx';
import { ComponentMap } from './renderer';
import { ADDON_ID, ADDON_PANEL, EVENTS } from './constants';

export interface Listener {
  next(
    scope: 'current' | 'jsx'
  ): typeof scope extends 'current'
    ? (id: string) => void
    : (id: string, jsx: string, components: ComponentMap) => void;
}

/** A function that lets the panel listen to storybook event */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const observable = (channel: Channel, api: any) => (listener: Listener) => {
  const addJsxListener = listener.next('jsx');
  const storyRenderedListener = listener.next('current');
  channel.on(EVENTS.ADD_JSX, addJsxListener);
  api.on(STORY_RENDERED, storyRenderedListener);

  /**
   * Unregisters the storybook event listeners.
   */
  const unsubscribe = () => {
    channel.off(EVENTS.ADD_JSX, addJsxListener);
    api.off(STORY_RENDERED, storyRenderedListener);
  };

  return unsubscribe;
};

addons.register(ADDON_ID, api => {
  const ob = observable(addons.getChannel(), api);

  addons.addPanel(ADDON_PANEL, {
    title: 'JSX',
    render: ({ active }) => <JSX key="addon-jsx" active={active} ob={ob} />
  });
});
