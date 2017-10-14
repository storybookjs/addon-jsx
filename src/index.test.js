import initStoryshots from '@storybook/addon-storyshots'

global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0)
}

initStoryshots({
  configPath: './example/.storybook',
})
