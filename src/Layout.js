import React from 'react';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import './styles/index.scss';

import routes from './routes';

const Layout = () => (
  <div>
    <nav className="header">
      <ul>
        <li>
          <Link to="/">Home (New)</Link>
        </li>
        <li>
          <Link to="/another">Another page</Link>
        </li>
      </ul>
    </nav>
    <div className="content">
      <Switch>
        {routes.map(route => (
          <Route key={route.name} {...route} />
        ))}
      </Switch>
    </div>
  </div>
);

export default Layout;
