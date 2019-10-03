import Home from './home';
import Another from './another-page';
import NotFound from './not-found';

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
