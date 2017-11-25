/* global PHP, echo */
import React from 'react';
import { hydrate } from 'react-dom';
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
		<App posts={ [] } />
	</BrowserRouter>,
	document.getElementById( "app" ) );
}
