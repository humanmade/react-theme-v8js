/* global PHP, echo */
import React from 'react';
import ReactDOM, { hydrate } from 'react-dom';
import { renderToString } from 'react-dom/server';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import StaticRouter from 'react-router-dom/StaticRouter';
import { BrowserRouter } from 'react-router-dom';

if ( typeof isSSR !== 'undefined' ) {
	const data = PHP.rest_request( 'GET', '/wp/v2/posts' ).data;
	let context = {};
	echo( renderToString(
		<StaticRouter location={ window.location.pathname } context={ context }>
			<App posts={ data } />
		</StaticRouter>) );
} else {
	hydrate( <BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById( "app" ) );
}


if ( module.hot ) {
	module.hot.accept( './App', () => {
		const NextApp = require( './App' ).default;
		ReactDOM.render( <BrowserRouter>
			<NextApp />
		</BrowserRouter>, document.getElementById( "app" ) );
	} );
}
