import mixins from 'postcss-mixins'
import nesting from 'postcss-nesting'
import responsiveType from 'postcss-responsive-type'
import hoverMediaFeature from 'postcss-hover-media-feature'
import autoprefixer from 'autoprefixer'

export default {
   plugins: [mixins(), autoprefixer(), nesting(), responsiveType(), hoverMediaFeature()],
}
