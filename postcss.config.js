import postcssNesting from 'postcss-nesting'
import responsiveType from 'postcss-responsive-type'
import hoverMediaFeature from 'postcss-hover-media-feature'
import autoprefixer from 'autoprefixer'

export default {
   plugins: [autoprefixer(), postcssNesting(), responsiveType(), hoverMediaFeature()],
}
