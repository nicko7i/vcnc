import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import HomePage from './containers/HomePage';
import FilesPage from './containers/FilesPage'; // eslint-disable-line import/no-named-as-default
import MountsPage from './containers/MountsPage'; // eslint-disable-line import/no-named-as-default
import WorkspacesPage from './containers/WorkspacesPage'; // eslint-disable-line import/no-named-as-default
import NotFoundPage from './components/NotFoundPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage}/>
    <Route path="files" component={FilesPage}/>
    <Route path="mounts" component={MountsPage}/>
    <Route path="workspaces" component={WorkspacesPage}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);
