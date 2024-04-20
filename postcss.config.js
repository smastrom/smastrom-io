import globalData from '@csstools/postcss-global-data'
import mixins from 'postcss-mixins'
import customMedia from 'postcss-custom-media'
import nesting from 'postcss-nesting'
import hoverMediaFeature from 'postcss-hover-media-feature'
import autoprefixer from 'autoprefixer'

export default {
   plugins: [
      globalData({
         files: ['./src/styles/breakpoints.css'],
      }),
      mixins(),
      nesting(),
      hoverMediaFeature(),
      customMedia(),
      autoprefixer(),
   ],
}
