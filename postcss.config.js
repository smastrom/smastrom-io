import globalData from '@csstools/postcss-global-data'
import mixins from 'postcss-mixins'
import customMedia from 'postcss-custom-media'
import nesting from 'postcss-nesting'
import autoprefixer from 'autoprefixer'

export default {
   plugins: [
      globalData({
         files: ['./src/styles/breakpoints.css'],
      }),
      mixins(),
      nesting(),
      customMedia(),
      autoprefixer(),
   ],
}
