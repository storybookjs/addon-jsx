import { configure } from '@kadira/storybook'
import { setOptions } from '@kadira/storybook-addon-options'

function loadStories() {
  require('../stories')
}
setOptions({
  name: 'CUSTOM-OPTIONS',
  url: 'https://github.com/kadirahq/storybook-addon-options',
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: true,
  showSearchBox: false,
  downPanelInRight: true,
  sortStoriesByKind: false,
})

configure(loadStories, module)
