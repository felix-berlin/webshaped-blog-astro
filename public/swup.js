import Swup from 'swup';
import SwupA11yPlugin from '@swup/a11y-plugin'
import SwupFadeTheme from '@swup/fade-theme';
import SwupHeadPlugin from '@swup/head-plugin';
import SwupProgressPlugin from '@swup/progress-plugin';

const swup = new Swup({
  plugins: [new SwupFadeTheme(), new SwupHeadPlugin(), new SwupA11yPlugin(), new SwupProgressPlugin()],
});
