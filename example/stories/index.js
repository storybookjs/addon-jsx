import React from 'react';
import { setAddon } from '@storybook/react';
import JSXAddon from '../../lib/index';

import SimpleStories from './simple';
import DeepStories from './deep';
import FunctionStories from './functions';
import ArrayStories from './array';
import WithPropsStories from './withProps';

setAddon(JSXAddon);

SimpleStories();
DeepStories();
FunctionStories();
ArrayStories();
WithPropsStories();
