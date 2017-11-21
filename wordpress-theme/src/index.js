import React from 'react';
import { hydrate } from 'react-dom';
import { renderToString } from 'react-dom/server';
import './index.css';
import App from './App';

if ( typeof isSSR !== 'undefined' ) {
	console.log( renderToString(<App />) );
} else {
	hydrate( <App />, document.getElementById( "app" ) );
}
