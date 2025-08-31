/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [ "./App.tsx", "./src/screens/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}" ],
  presets: [ require("nativewind/preset") ],
  theme: {
    extend: {
      colors: {
        brand: {
          '50': '#eff7ff',
          '100': '#dbecfe',
          '200': '#bfdefe',
          '300': '#93cafd',
          '400': '#60acfa',
          '500': '#3b8af6',
          '600': '#256ceb',
          '700': '#215ce1',
          '800': '#1e47af',
          '900': '#1e3f8a',
          '950': '#172854',
        },
      },
      fontFamily: {
        raleway: [ "Raleway-Regular" ],
        'raleway-bold': [ "Raleway-Bold" ],
        'raleway-semibold': [ "Raleway-SemiBold" ],
        'raleway-medium': [ "Raleway-Medium" ],
        'raleway-light': [ "Raleway-Light" ],
        'raleway-extralight': [ "Raleway-ExtraLight" ],
        'raleway-thin': [ "Raleway-Thin" ],
        montserrat: [ "Montserrat-Regular" ],
        'montserrat-bold': [ "Montserrat-Bold" ],
        'montserrat-semibold': [ "Montserrat-SemiBold" ],
        'montserrat-medium': [ "Montserrat-Medium" ],
        'montserrat-light': [ "Montserrat-Light" ],
        'montserrat-extralight': [ "Montserrat-ExtraLight" ],
        'montserrat-thin': [ "Montserrat-Thin" ],
      }
    }
  },
  plugins: [],
}