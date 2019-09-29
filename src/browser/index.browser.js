import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-boost';
import Layout from '../Layout';

const client = new ApolloClient({
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
  uri: 'https://48p1r2roz4.sse.codesandbox.io',
});

const App = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </ApolloProvider>
);

hydrate(<App />, document.getElementById('root'));
