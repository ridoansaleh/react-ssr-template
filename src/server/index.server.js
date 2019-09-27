import path from 'path';
import fs from 'fs';
import nodeFetch from 'node-fetch';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ApolloProvider } from '@apollo/react-common';
import { getDataFromTree } from '@apollo/react-ssr';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import express from 'express';
import { StaticRouter } from 'react-router';
import { InMemoryCache } from 'apollo-cache-inmemory';
import cors from 'cors';

import Layout from '../Layout';

const basePort = 3000 || process.env.PORT;

const app = new express();

app.use(cors());

app.use(express.static('../../dist'));

app.get('*', (req, res) => {
  const client = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: 'https://48p1r2roz4.sse.codesandbox.io',
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

      console.log('initialState : ', JSON.stringify(initialState));

      const indexFile = path.resolve('./dist/index.html');

      fs.readFile(indexFile, 'utf8', (err, data) => {
        if (err) {
          console.error('Something went wrong:', err);
          res.status(500);
          res.send('Oops, better luck next time!');
          res.end();
        }
        console.log('data : ', data);
        data = data.replace('<div id="root"></div>', `<div id="root">${content}</div>`);
        data = data.replace(
          `<div id="script"></div>`,
          `<script>
            window.__APOLLO_STATE__=${JSON.stringify(initialState).replace(/</g, '\\u003c')}
          </script>`,
        );
        res.status(200);
        res.send(data);
        res.end();
      });
    })
    .catch(err => console.log(err));
});

app.listen(basePort, () => {
  console.log(`Application Server is now running on http://localhost:${basePort}`);
});
