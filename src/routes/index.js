import HomePage from './home';
import AnotherPage from './another-page';

const routes = [
  {
    path: '/',
    name: 'home',
    exact: true,
    component: HomePage,
  },
  {
    path: '/another',
    name: 'another',
    component: AnotherPage,
  },
];

export default routes;
