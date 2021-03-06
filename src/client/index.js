import React from 'react';
import { fromJS } from 'immutable';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { match, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import ApiClient from '../helpers/ApiClient';
import Root from './root';
import getRoutes from '../app/routes';
import configureStore from '../app/redux/store';
import { createSelectLocationState } from '../app/utils';

const client = new ApiClient();
const initialState = fromJS(window.__INITIAL_STATE__);
const store = configureStore(browserHistory, client, initialState);
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: createSelectLocationState('routing')
});
const renderApp = renderProps => render(
  <AppContainer>
    <Root {...{ store, history, ...renderProps }} />
  </AppContainer>,
  document.getElementById('root')
);

match(
  { history, routes: getRoutes(store) },
  (error, redirectLocation, renderProps) => renderApp(renderProps)
);

if (module.hot) {
  module.hot.accept('../app/routes', () => {
    const nextRoutes = require('../app/routes');
    renderApp({ routes: nextRoutes(store) });
  });
}
