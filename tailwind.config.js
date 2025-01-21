// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],

  theme: {
    extend: {
      transitionProperty: {
        'width': 'width'
      },
      width: {
        '0': '0',
        'full': '100%'
      }
    }
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'source-map-loader',
        enforce: 'pre',
        exclude: /node_modules\/(?!html5-qrcode)/, // Exclude specific node modules
      },
    ],
  },

}

