import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import withApiData from './with-api-data';
import PostList from './PostList';
import Post from './Post';
import { Route } from 'react-router-dom';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hello: 'awd',
		}
	}
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React, { this.props.user.isLoading || this.props.user.error ? '' : this.props.user.data.name }</h1>
				</header>
				<PostList />
				<Route path="/:slug/" component={ Post } />
			</div>
		);
	}
}

export default withApiData( props => (
	{
		posts: '/wp/v2/posts',
		user: '/wp/v2/users/me'
	}
) )( App );
