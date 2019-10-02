## Bundler / Tasks List

1. [x] create webpack config files for `server` and `client`
2. [x] react-apollo
3. [x] sass and file-loader
4. [x] babel-polyfill
5. [x] split vendor libs from main bundle
6. [x] route based splitting
7. [x] mini-css-extract-plugin
8. [ ] HMR
9. [ ] npm scripts for dev and production
10. [ ] deploy to Heroku

#### Evaluations

- use core-js instead of babel-polyfill

## From Server

1. Read data (user) from cookie in server
2. Fetch data based on that cookie (if exist)
3. Fetch data based on route ?
4. Save user's data on window in string HTML
5. Response request with string HTML
6. Hydrate on the client (add eventListener)
7. If user is login, redirect to Home page (useContext)
8. If user is NOT login, redirect to Login page

## Webpack Dev Middleware

1. bundle client inside of server (development)
2. use `webpack-hot-middleware` for HMR
3. spits html (and React component) from server
4. the html file used in server is from webpack client (HtmlWebpackPlugin)
5. does server (nodejs) understand React, CSS, image etc?
6. or do we need to transpile it again using webpack?
