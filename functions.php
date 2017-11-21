<?php

namespace HM\React_Theme;

use V8Js;
use WP_REST_Request;

add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_scripts' );

/**
 * Proper way to enqueue scripts and styles
 */
function enqueue_scripts() {
	$manifest = json_decode( file_get_contents( __DIR__ . '/wordpress-theme/build/asset-manifest.json' ), true );

	wp_enqueue_style( 'react', get_template_directory_uri() . '/wordpress-theme/build/' . $manifest['main.css'] );
	wp_enqueue_script( 'react', get_template_directory_uri() . '/wordpress-theme/build/' . $manifest['main.js'], [], null, true );
}

function render_react_app() {
	$manifest = json_decode( file_get_contents( __DIR__ . '/wordpress-theme/build/asset-manifest.json' ), true );
	$react = [];
	// stubs, react
	$react[] = 'var console = {warn: print, error: print, log: it => print( JSON.stringify( it ) ) };';
	$react[] = 'var echo = print;';
	$react[] = 'var global = global || this, self = self || this, window = { location: { hostname: "localhost" } } || this;';
	$react[] = 'var isSSR = true;';
	// app's components
	$react[] = file_get_contents( __DIR__ . '/wordpress-theme/build/' . $manifest['main.js'] );
	$react[] = ';';
	$concatenated = implode( ";\n", $react );

	$v8 = new V8Js();
	$v8->rest_request = function( $method, $route ) {
		return rest_do_request( new WP_REST_Request( $method, $route ) );
	};
	echo '<div id="app">';
	$v8->executeString( $concatenated );
	echo '</div>';
}
