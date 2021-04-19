import polyfill from './config/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root';
import { AppContainer } from 'react-hot-loader';

import store from './config/store';

//import 'bootstrap/dist/css/bootstrap.css';
//import 'font-awesome/css/font-awesome.css';
//import '../public/fonts/table/mytable.css';
import 'animate.css/animate.min.css';

require('./sass/style.scss');

ReactDOM.render(
  <AppContainer>
    <Root store={store}/>
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept(['./root'], () => {
    const Root = require('./root').default;
    ReactDOM.render(
      <AppContainer>
        <Root store={store}/>
      </AppContainer>,
      document.getElementById('root')
    );
  });
}