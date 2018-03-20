import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PersistGate } from 'redux-persist/es/integration/react';
// import { connect } from 'react-redux';
import Home from '../components/Home';

class Root extends Component{
	
	render() {
		return	(
			<Home />

		)
	}
}

export default Root
