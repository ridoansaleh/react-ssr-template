const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const cors = require('cors');
const nodeFetch = require('node-fetch');

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { ApolloProvider } = require('@apollo/react-common');
const { getDataFromTree } = require('@apollo/react-ssr');
const { ApolloClient } = require('apollo-client');
const { createHttpLink } = require('apollo-link-http');
const { StaticRouter } = require('react-router');
const { InMemoryCache } = require('apollo-cache-inmemory');
const Layout = require('../src/Layout');
const { GRAPHQL_API } = require('../src/constant');

const config = require('./config/webpack.client');

const compiler = webpack(config);

const PORT = 3000 || process.env.PORT;

const app = express();

app.use(
  webpackDevMiddleware(compiler, {
    serverSideRender: true,
    noInfo: true,
    publicPath: config.output.publicPath,
  }),
);

app.use(webpackHotMiddleware(compiler));

app.use(cors());

app.use('/static', express.static('dist'));

app.get('*', (req, res) => {
  const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName;
  const fs = res.locals.fs;
  const outputPath = res.locals.webpackStats.toJson().outputPath;

  const client = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: GRAPHQL_API,
      // credentials: 'same-origin',
      fetch: nodeFetch,
      headers: {
        cookie: req.header('Cookie'),
      },
    }),
    cache: new InMemoryCache(),
  });

  const context = {};

  const App = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={context}>
        <Layout />
      </StaticRouter>
    </ApolloProvider>
  );

  getDataFromTree(App)
    .then(() => {
      const content = ReactDOMServer.renderToString(App);
      const initialState = client.extract();
      res.status(200);
      res.send(`
        <html>
          <head>
            <title>React SSR Wakeup</title>
            <style>
            ${normalizeAssets(assetsByChunkName.main)
              .filter(path => path.endsWith('.css'))
              .map(path => fs.readFileSync(outputPath + '/' + path))
              .join('\n')}
            </style>
          </head>
          <body>
            <div id="root">${content}</div>
            <script>
              window.__APOLLO_STATE__=${JSON.stringify(initialState).replace(/</g, '\\u003c')}
            </script>
            ${normalizeAssets(assetsByChunkName.main)
              .filter(path => path.endsWith('.js'))
              .map(path => `<script src="${path}"></script>`)
              .join('\n')}
          </body>
        </html>
      `);
    })
    .catch(err => console.log(err));
});

app.listen(PORT, () => {
  console.log('App is running on port 3000');
});
