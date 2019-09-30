import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import fs from 'fs';
import nodeFetch from 'node-fetch';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Loadable from 'react-loadable';
// import { getBundles } from 'react-loadable/webpack';
import { ApolloProvider } from '@apollo/react-common';
import { getDataFromTree } from '@apollo/react-ssr';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import express from 'express';
import { StaticRouter } from 'react-router';
import { InMemoryCache } from 'apollo-cache-inmemory';
import cors from 'cors';

import Layout from '../Layout';
import { GRAPHQL_API } from '../constant';

const basePort = 3000 || process.env.PORT;

const app = express();

app.use(cors());

app.use('/static', express.static('dist'));

app.get('*', (req, res) => {
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
  const modules = [];

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
      // const stats = require('../../dist/react-loadable.json');

      const content = ReactDOMServer.renderToString(App);

      // let bundles = getBundles(stats, modules);

      const initialState = client.extract();

      const indexFile = path.resolve('./dist/index.html');

      fs.readFile(indexFile, 'utf8', (err, data) => {
        if (err) {
          console.error('Something went wrong:', err);
          res.status(500);
          res.send('Oops, better luck next time!');
          res.end();
        }

        data = data.replace('<div id="root"></div>', `<div id="root">${content}</div>`);
        data = data.replace(
          `<div id="script"></div>`,
          `<script>
            window.__APOLLO_STATE__=${JSON.stringify(initialState).replace(/</g, '\\u003c')}
          </script>`,
        );
        // data = data.replace(
        //   '<div id="route-split></div>',
        //   ` ${bundles
        //     .map(bundle => {
        //       return `<script src="${bundle.publicPath}/${bundle.file}"></script>`;
        //     })
        //     .join('\n')}`,
        // );
        res
          .status(200)
          .send(data)
          .end();
      });
    })
    .catch(err => console.log(err));
});

Loadable.preloadAll().then(() => {
  app.listen(basePort, () => {
    console.log(`Application Server is now running on http://localhost:${basePort}`);
  });
});
