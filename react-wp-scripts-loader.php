<?php
/**
 * Entrypoint for the theme.
 */

namespace ReactWPScripts;

/**
 * Is this a development environment?
 *
 * @return bool
 */
function is_development() {
	return apply_filters( 'reactwpscripts.is_development', WP_DEBUG );
}

/**
 * Get the port for React's development server.
 *
 * @return int|null Port number if available, otherwise null.
 */
function get_react_port() {
	if ( ! is_development() ) {
		return null;
	}

	$path = get_theme_file_path( 'react-port' );
	if ( ! file_exists( $path ) ) {
		return null;
	}

	$port = file_get_contents( $path );
	if ( empty( $port ) || ! is_numeric( $port ) ) {
		return null;
	}

	return (int) trim( $port );
}

function enqueue_assets( $id, $deps = [] ) {
	$port = get_react_port();
	if ( $port ) {
		$manifest = json_decode( file_get_contents( __DIR__ . '/build/asset-manifest.json' ), true );
		wp_enqueue_style(
			$id,
			get_theme_file_uri( 'build/' . $manifest['main.css'] )
		);
		wp_enqueue_script(
			$id,
			sprintf( 'http://localhost:%d/static/js/bundle.js', $port ),
			$deps,
			null,
			true
		);
	} else {
		$manifest = json_decode( file_get_contents( __DIR__ . '/build/asset-manifest.json' ), true );
		wp_enqueue_script(
			$id,
			get_theme_file_uri( 'build/' . $manifest['main.js'] ),
			$deps,
			null,
			true
		);
		wp_enqueue_style(
			$id,
			get_theme_file_uri( 'build/' . $manifest['main.css'] )
		);
	}
}
