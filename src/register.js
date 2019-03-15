import React, { Component } from 'react';
import addons from '@storybook/addons';

import JSX from './jsx';

const Observable = (channel, api) => listener => {
  channel.on('kadira/jsx/add_jsx', listener.next('jsx'));
  api.onStory(listener.next('current'));
};

addons.register('kadira/jsx', api => {
  const ob = Observable(addons.getChannel(), api);

  addons.addPanel('kadira/jsx/panel', {
    title: 'JSX',
    render: ({ active }) => <JSX active={active} ob={ob} />
  });
});
