import React from 'react';
import Loadable from 'react-loadable';

const HomeComponent = Loadable({
  loader: () => import('./home' /* webpackChunkName: 'home' */),
  loading() {
    return <div>Loading...</div>;
  },
});

const AnotherComponent = Loadable({
  loader: () => import('./another-page' /* webpackChunkName: 'another-page' */),
  loading() {
    return <div>Loading...</div>;
  },
});

const routes = [
  {
    path: '/',
    name: 'home',
    exact: true,
    component: HomeComponent,
  },
  {
    path: '/another',
    name: 'another',
    component: AnotherComponent,
  },
];

export default routes;
