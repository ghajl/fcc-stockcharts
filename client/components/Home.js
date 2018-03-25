import React from 'react';
import Header from './Header';
import Footer from './Footer';
import injectSheet from 'react-jss';
import Highcharts from 'highcharts';
var addFunnel = require('highcharts/modules/funnel')(Highcharts);
// import { connect } from 'react-redux';


const styles = {
	app: {
        display: 'flex',
        'flex-direction': 'column',
        height: '100%',
    },
    content: {
        flex: '1 0 auto', 
        width: '100%',
        display: 'flex',
        'flex-direction': 'column',

        // height: '100%',
    }
}

const Home = (props) => {
    // addFunnel(Highcharts);
    // Highcharts.chart('container', { chart: {
    //         type: 'bar'
    //     },
    //     title: {
    //         text: 'Fruit Consumption'
    //     },
    //     xAxis: {
    //         categories: ['Apples', 'Bananas', 'Oranges']
    //     },
    //     yAxis: {
    //         title: {
    //             text: 'Fruit eaten'
    //         }
    //     },
    //     series: [{
    //         name: 'Jane',
    //         data: [1, 0, 4]
    //     }, {
    //         name: 'John',
    //         data: [5, 7, 3]
    //     }] });
	return (
	    <div className={props.classes.app}>
	    <Header 
        	

    	/>
    	<div className={props.classes.content} id="container">

		    Stock Charts
		</div>    
		<Footer />
	    </div>
    )
}

export default injectSheet(styles)(Home);