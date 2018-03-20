import "babel-polyfill";
import 'normalize.css';
import React from 'react';
import {render} from 'react-dom';
// import { configureStore } from './store';
import Root from './client/containers/Root'
// const {store, persistor} = configureStore(history);

render(
    <Root 
  		/>,
    document.getElementById('root')
)

