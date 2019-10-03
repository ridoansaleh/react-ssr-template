import React from 'react';
import './not-found.style.scss';

function NotFound({ location }) {
  return (
    <div className="not-found-wrapper">
      <h1 className="not-found-text">404 | {location.pathname} is Not Found</h1>
    </div>
  );
}

export default NotFound;
