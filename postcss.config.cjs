const postcssNesting = require('postcss-nesting')
const responsiveType = require('postcss-responsive-type')
const hoverMediaFeature = require('postcss-hover-media-feature')
const autoprefixer = require('autoprefixer')

const config = {
   plugins: [autoprefixer(), postcssNesting(), responsiveType(), hoverMediaFeature()],
}

module.exports = config
