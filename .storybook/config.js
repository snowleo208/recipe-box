import { configure, addParameters } from '@storybook/angular';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

// automatically import all files ending in *.stories.ts
const req = require.context('../src/stories', true, /\.stories\.ts$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addParameters({
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS
    }
  }
});

configure(loadStories, module);
