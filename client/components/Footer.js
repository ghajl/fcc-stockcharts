import React from "react";
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import compose from 'recompose/compose';

const styles = {
	wrapper: {
		textAlign: 'center',
		backgroundColor: 'white',
		boxShadow: '0 -2px 4px rgba(0,0,0,.1)',
	},
	element: {
		display: 'inline-block',
		maxWidth: '160px',
		textAlign: 'center',
	},
	container: {
		display: 'inline-block',
		width:'auto',
		textAlign: 'center',
	},
	icon: {
		transition: '.4s',
		borderRadius: '50%',
		border: '1px solid',
		borderColor: 'gray',
		padding: '5px',
		margin: '.5em',
		width: '24px',
		height: '24px',
		'&:hover': {
	        borderColor: 'black',
			backgroundColor: 'black',
			fill: 'white',
	    }
	},
	a: {
		color: 'gray',
		fill: 'gray',

		'&:hover': {
			color: 'black',
		}
	},
	item: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		minWidth:'130px',
		fontSize:'.9em',
	},
	link: {
		margin: '5px auto 5px',
	}
}						



const Footer = (props) => {
	const {classes} = props;
        !function foo(){console.log("111") }()
	return (
		<div className={classes.wrapper}>
			<div className={classes.container}>
				<div className={classes.element}>
					<div className={classes.link}>
						<div>
							<a href="https://github.com/ghajl/fcc-nightlife" target="_blank" className={classes.a}>
							<div className={classes.item}>
			                    <svg className={classes.icon}>
								    <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
							    </svg>
								
							</div>
							</a>
						</div>    
					</div>
				</div>
				<div className={classes.element}>
					<div className={classes.link}>
						<div>
							<a href="mailto:michaelknn@gmail.com?subject=Mail from BC" target="_blank"  className={classes.a}>
							<div className={classes.item}>
								<svg className={classes.icon}>
								    <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
								</svg>
								
							</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}


export default injectSheet(styles)(Footer);
