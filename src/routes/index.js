import loadable from '@loadable/component';

const Home = loadable(() => import('./home'));
const Another = loadable(() => import('./another-page'));
const NotFound = loadable(() => import('./not-found'));

const routes = [
  {
    path: '/',
    name: 'home',
    exact: true,
    component: Home,
  },
  {
    path: '/another',
    name: 'another',
    component: Another,
  },
  {
    path: '*',
    name: 'not_found',
    component: NotFound,
  },
];

export default routes;
