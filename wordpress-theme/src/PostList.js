import React from'react';
import withApiData from './with-api-data';
import { Link } from 'react-router-dom';

function PostList( props ) {
	return <ul>
		{ props.posts.data && props.posts.data.map( post => (
			<li key={ post.id }><Link to={ new URL( post.link ).pathname }>{ post.title.rendered }</Link></li>
		))}
	</ul>
}

export default withApiData( props => ( {
	posts: '/wp/v2/posts',
}))( PostList );
