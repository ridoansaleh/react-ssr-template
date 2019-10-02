// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
import { hot } from 'react-hot-loader/root';
import React from 'react';
import { hydrate } from 'react-dom';
import Loadable from 'react-loadable';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-boost';
import Layout from '../Layout';
import { GRAPHQL_API } from '../constant';

const client = new ApolloClient({
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
  uri: GRAPHQL_API,
});

const App = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </ApolloProvider>
);

const HotApp = hot(App);

Loadable.preloadReady().then(() => {
  hydrate(<HotApp />, document.getElementById('root'));
});
