/* global isSSR, PHP */

import React, { Component } from 'react';
import qs from 'qs';

import api from './wp-rest-api';

const requests = {};

export default ( mapPropsToData ) => ( WrappedComponent ) => {
	class APIDataComponent extends Component {
		constructor( props ) {
			super( props );
			if ( typeof isSSR !== 'undefined' ) {
				this.state = {
					dataProps: this.fetchDataSSR( props, this.getPropsMapping() ),
				};
			} else {
				this.state = {
					dataProps: this.getPropsMapping(),
				};
			}

			this.api = new api( {
				rest_url:    window.wpApiSettings.root,
				credentials: { nonce: window.wpApiSettings.nonce },
			} );
		}

		componentDidMount() {
			this.fetchData( this.props );
		}

		componentWillUnmount() {
			this.unmounted = true;
		}

		getPropsMapping() {
			const dataMap = mapPropsToData( this.props );
			const keys = Object.keys( dataMap );
			const dataProps = {};
			keys.forEach( key => {
				dataProps[ key ] = {
					isLoading: true,
					error: null,
					data: null,
				}
			} );
			return dataProps;
		}

		componentWillReceiveProps( nextProps ) {
			this.fetchData( nextProps );
		}

		fetchDataSSR( props, dataProps ) {
			const dataMap = mapPropsToData( props );
			Object.entries( dataMap ).forEach( ( [ key, url ] ) => {
				let data = null;
				let endpoint = url;
				if ( url.indexOf( '?' ) ) {
					endpoint = url.split( '?' )[0];
					data = qs.parse( url.split( '?' )[1] );
				}
				const response = PHP.rest_request( 'GET', endpoint, data );
				dataProps[ key ].data = response;
				dataProps[ key ].isLoading = false;
			} );
			return dataProps;
		}

		fetchData( props ) {
			const dataMap = mapPropsToData( props );
			const dataProps = { ...this.state.dataProps };

			Object.entries( dataMap ).forEach( ( [ key, endpoint ] ) => {
				const handleData = data => {
					if ( this.unmounted ) {
						return data;
					}
					const prop = {
						error: null,
						isLoading: false,
						data,
					};
					this.setState({
						dataProps: {
							...this.state.dataProps,
							[ key ]: prop,
						}
					});
					return data;
				};
				const handleError = error => {
					if ( this.unmounted ) {
						return error;
					}
					const data = {
						error,
						isLoading: false,
						data: null,
					};
					this.setState({
						dataProps: {
							...this.state.dataProps,
							[ key ]: data
						}
					})
				};

				const cacheKey = `GET::${endpoint}`;
				dataProps[ key ] = {
					isLoading: true,
					error: null,
					data: null,
				};
				if ( requests[ cacheKey ] ) {
					return requests[ cacheKey ].then( handleData ).catch( handleError )
				} else if ( window.wpRestApiData[ cacheKey ] ) {
					dataProps[ key ] = {
						isLoading: false,
						error: null,
						data: window.wpRestApiData[ cacheKey ],
					};
				} else {
					return requests[ cacheKey ] = this.api.get( endpoint ).then( handleData ).catch( handleError )
				}

			} );
			this.setState( { dataProps } );
		}

		render() {
			return (
				<WrappedComponent
					{ ...this.props }
					{ ...this.state.dataProps } />
			);
		}
	}

	// Derive display name from original component
	const { displayName = WrappedComponent.name || 'Component' } = WrappedComponent;
	APIDataComponent.displayName = `apiData(${ displayName })`;

	return APIDataComponent;
};
