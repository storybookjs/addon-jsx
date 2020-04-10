import { configure, setAddon, addDecorator } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';
import { withPropsTable } from 'storybook-addon-react-docgen';
import JSXAddon from '../../lib/index';

setAddon(JSXAddon);
addDecorator(withPropsTable);

function loadStories() {
  require('../stories');
}

withOptions({
  brandTitle: 'CUSTOM-OPTIONS',
  brandUrl: 'https://github.com/kadirahq/storybook-addon-options'
});

configure(loadStories, module);
