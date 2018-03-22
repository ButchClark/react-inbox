import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import 'font-awesome/css/font-awesome.css'
import './index.css';
import ReactInbox from './components/ReactInbox'
import registerServiceWorker from './registerServiceWorker';
import {Provider} from 'react-redux'
import {getMessages} from "./actions";
import store from './store'

store.dispatch(getMessages())

ReactDOM.render(
	<Provider store={store}>
		<ReactInbox />
	</Provider>
	,document.getElementById('root'));

registerServiceWorker();
