/* global PHP, echo */
import React from 'react';
import { hydrate } from 'react-dom';
import { renderToString } from 'react-dom/server';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

if ( typeof isSSR !== 'undefined' ) {
	const data = PHP.rest_request( 'GET', '/wp/v2/posts' ).data;
	echo( renderToString(<App posts={ data } />) );
} else {
	hydrate( <App posts={ [] } />, document.getElementById( "app" ) );
}
