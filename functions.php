<?php

namespace HM\React_Theme;

use ReactWPScripts;
use V8Js;
use WP_REST_Request;
use Exception;

require_once __DIR__ . '/react-wp-scripts-loader.php';

add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_scripts' );

/**
 * Proper way to enqueue scripts and styles
 */
function enqueue_scripts() {
	ReactWPScripts\enqueue_assets( 'react', [ 'wp-api' ] );
}

function render_react_app() {
	$manifest = json_decode( file_get_contents( __DIR__ . '/build/asset-manifest.json' ), true );
	$react = [];
	// stubs, react
	$react[] = 'var console = {warn: print, error: print, log: it => print( JSON.stringify( it ) ) };';
	$react[] = 'var echo = print;';
	$react[] = 'var global = global || this, self = self || this, window = { location: { hostname: "' . $_SERVER['HTTP_HOST'] . '", "pathname": "' . $_SERVER['REQUEST_URI'] . '" }, wpApiSettings: { root: "", nonce: "" } } || this;';
	$react[] = 'var isSSR = true;';
	// app's components
	$react[] = file_get_contents( __DIR__ . '/build/' . $manifest['main.js'] );
	$react[] = ';';
	$concatenated = implode( ";\n", $react );

	$rest_api_data = [];

	$v8 = new V8Js();
	$v8->rest_request = function( $method, $route, $data = null ) use ( & $rest_api_data ) {
		$cache_key = "$method::$route" . ( (array) $data ? '?' . http_build_query( (array) $data ) : '' );
		if ( isset( $rest_api_data[ $cache_key ] ) ) {
			return $rest_api_data[ $cache_key ];
		}
		$request = new WP_REST_Request( $method, untrailingslashit( $route ) );
		$request->set_query_params( (array) $data );
		$data = rest_do_request( $request )->get_data();
		$rest_api_data[ $cache_key ] = $data;
		return $data;
	};

	echo '<div id="app">';
	try {
		$v8->executeString( $concatenated );
		wp_localize_script( 'react', 'wpRestApiData', $rest_api_data );
	} catch ( Exception $e ) {
		var_dump( $e->getJsTrace() );
	}
	echo '</div>';

}
