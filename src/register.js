import React, { Component } from 'react';
import { addons } from '@storybook/addons';
import { STORY_RENDERED } from '@storybook/core-events';

import JSX from './jsx';

const Observable = (channel, api) => listener => {
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
