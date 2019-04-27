import { configure, setAddon } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';
import JSXAddon from '../../lib/index';

setAddon(JSXAddon);

function loadStories() {
  require('../stories');
}

withOptions({
  brandTitle: 'CUSTOM-OPTIONS',
  brandUrl: 'https://github.com/kadirahq/storybook-addon-options'
});

configure(loadStories, module);
