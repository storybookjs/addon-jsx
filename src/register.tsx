import React from 'react';
import { addons } from '@storybook/addons';
import { STORY_RENDERED } from '@storybook/core-events';
import Channel from '@storybook/channels';

import JSX from './jsx';

export interface Listener {
  next(scope: string): (id: string, jsx?: string) => void;
}

const Observable = (channel: Channel, api: any) => (listener: Listener) => {
  channel.on('kadira/jsx/add_jsx', listener.next('jsx'));
  api.on(STORY_RENDERED, listener.next('current'));
};

addons.register('kadira/jsx', api => {
  const ob = Observable(addons.getChannel(), api);

  addons.addPanel('kadira/jsx/panel', {
    title: 'JSX',
    render: ({ active }) => <JSX active={active} ob={ob} />
  });
});
