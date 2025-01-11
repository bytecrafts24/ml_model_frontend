// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
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
}

