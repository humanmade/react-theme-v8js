import React from'react';
import withApiData from './with-api-data';

function Post( props ) {
	if ( props.post.isLoading ) {
		return <p>Loading...</p>
	}
	const post = props.post.data[ 0 ];
	return <div>
		<h1>{ post.title.rendered }</h1>
		<div dangerouslySetInnerHTML={ { __html: post.content.rendered } } />
	</div>
}

export default withApiData( props => ( {
	post: `/wp/v2/posts/?slug=${ props.match.params.slug }`,
}))( Post );
