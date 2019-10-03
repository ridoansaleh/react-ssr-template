import fs from 'fs';
import nodeFetch from 'node-fetch';
import express from 'express';
import cors from 'cors';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import { ApolloProvider } from '@apollo/react-common';
import { getDataFromTree } from '@apollo/react-ssr';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import Layout from '../Layout';
import { GRAPHQL_API } from '../constant';
import webpackConfig from '../../config/webpack.client';
import routes from '../routes';
import stats from '../../dist/react-loadable.json';

const PORT = 3000 || process.env.PORT;

const app = express();

app.use(cors());

app.use('/static', express.static('dist'));

app.get('*', (req, res) => {
  const context = {};
  const modules = [];

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

  routes.pop();
  const isRouteMatch = routes.some(route => matchPath(req.path, route));

  const App = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={context}>
        <Loadable.Capture report={moduleName => modules.push(moduleName)}>
          <Layout />
        </Loadable.Capture>
      </StaticRouter>
    </ApolloProvider>
  );

  getDataFromTree(App)
    .then(() => {
      const initialState = client.extract();
      const content = ReactDOMServer.renderToString(App);
      // console.log('modules : ', modules);
      const serverBundles = getBundles(stats, modules);
      // console.log('serverBundles : ', serverBundles);
      const clientBundles = fs.readdirSync('dist');
      // console.log('clientBundles : ', clientBundles);
      const { output } = webpackConfig;

      const htmlTemplate = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <title>React SSR Wakeup</title>
            <link rel="manifest" href="${output.publicPath}manifest.json" />
            <link rel="shortcut icon" href="${output.publicPath}icons/favicon.png">
            ${clientBundles
              .filter(file => file.endsWith('.css'))
              .map(cssFile => {
                return `<link rel="stylesheet" type="text/css" href="${output.publicPath}${cssFile}">`;
              })
              .join('\n')}
          </head>
          <body>
            <div id="root">${content}</div>
            <script>
              window.__APOLLO_STATE__=${JSON.stringify(initialState).replace(/</g, '\\u003c')}
            </script>
            ${clientBundles
              .filter(file => file.endsWith('.js'))
              .map(jsFile => {
                return `<script src="${output.publicPath}${jsFile}"></script>`;
              })
              .join('\n')}
            ${serverBundles
              .map(bundle => {
                return `<script src="${bundle.publicPath}/${bundle.file}"></script>`;
              })
              .join('\n')}
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

Loadable.preloadAll().then(() => {
  app.listen(PORT, () => {
    console.log(`Your amazing application is running on http://localhost:${PORT}`);
  });
});
