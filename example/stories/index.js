import React from 'react'
import { setAddon } from '@kadira/storybook'
import JSXAddon from '../../lib/index'

import SimpleStories from './simple'
import DeepStories from './deep'
import FunctionStories from './functions'
import ArrayStories from './array'

setAddon(JSXAddon)

SimpleStories()
DeepStories()
FunctionStories()
ArrayStories()
