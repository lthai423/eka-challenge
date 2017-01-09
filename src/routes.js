import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {
    App,
    Home,
    About,
    NotFound,
    AboutMe
  } from 'containers';

export default () => {
  return (
    <Route path="/" component={App}>
      { /* Home (main) route */ }
      <IndexRoute component={Home} />

      { /* Routes */ }
      <Route path="about" component={About} />
      <Route path="aboutMe" component={AboutMe} />
      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
