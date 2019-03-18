import { configure, setAddon } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import JSXAddon from '../../lib/index';

setAddon(JSXAddon);

function loadStories() {
  const req = require.context('../stories/', true, /\.stories\.js$/);
  req.keys().forEach(req);
}

setOptions({
  name: 'CUSTOM-OPTIONS',
  url: 'https://github.com/kadirahq/storybook-addon-options',
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: true,
  showSearchBox: false,
  downPanelInRight: true,
  sortStoriesByKind: false
});

configure(loadStories, module);
