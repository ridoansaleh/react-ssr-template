import path from 'path';
import nodeFetch from 'node-fetch';
import express from 'express';
import cors from 'cors';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router';
import { ApolloProvider } from '@apollo/react-common';
import { getDataFromTree } from '@apollo/react-ssr';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ChunkExtractor } from '@loadable/server';

import Layout from '../Layout';
import { GRAPHQL_API } from '../constant';
import webpackConfig from '../../config/webpack.client';
import routes from '../routes';
const statsFile = path.resolve('dist/loadable-stats.json');

const PORT = 3000 || process.env.PORT;
routes.pop();
const validRoutes = routes;

const app = express();

app.use(cors());

app.use('/static', express.static('dist'));

app.get('*', (req, res) => {
  const context = {};
  const extractor = new ChunkExtractor({ statsFile });

  const apolloClient = new ApolloClient({
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

  const isRouteMatch = validRoutes.some(route => matchPath(req.path, route));

  const App = () => (
    <ApolloProvider client={apolloClient}>
      <StaticRouter location={req.url} context={context}>
        <Layout />
      </StaticRouter>
    </ApolloProvider>
  );

  const jsxContent = extractor.collectChunks(<App />);

  getDataFromTree(jsxContent)
    .then(() => {
      const initialState = apolloClient.extract();
      const content = ReactDOMServer.renderToString(jsxContent);
      const { publicPath } = webpackConfig.output;

      const scriptTags = extractor.getScriptTags();
      const linkTags = extractor.getLinkTags();
      const styleTags = extractor.getStyleTags();

      const htmlTemplate = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <title>React SSR Template</title>
            <link rel="manifest" href="${publicPath}manifest.json" />
            <link rel="shortcut icon" href="${publicPath}icons/favicon.png">
            ${styleTags}
            ${linkTags}
          </head>
          <body>
            <div id="root">${content}</div>
            <script>
              window.__APOLLO_STATE__=${JSON.stringify(initialState).replace(/</g, '\\u003c')}
            </script>
            ${scriptTags}
          </body>
        </html>
      `;
      if (isRouteMatch) {
        res.status(200).send(htmlTemplate);
      } else {
        res.status(404).send(htmlTemplate);
      }
    })
    .catch(err => console.log(err));
});

app.listen(PORT, () => {
  console.log(`Your amazing application is running on http://localhost:${PORT}`);
});
