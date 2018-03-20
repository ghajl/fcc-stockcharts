import React from 'react';
import Header from './Header';
import Footer from './Footer';
import injectSheet from 'react-jss';
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
	return (
	    <div className={props.classes.app}>
	    <Header 
        	

    	/>
    	<div className={props.classes.content}>
        
		    Stock Charts
		</div>    
		<Footer />
	    </div>
    )
}

export default injectSheet(styles)(Home);