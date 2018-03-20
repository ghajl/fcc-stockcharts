import React from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';



const styles = {
    nav: {
        // display: 'flex',
        // flexWrap: 'wrap',
        textAlign: 'center',
        'text-transform': 'uppercase',
        // height: '60px',
        // justifyContent: 'center',
        
        // padding: '15px',
        overflow: 'hidden',
        boxShadow: '0 4px 4px rgba(0,0,0,.1)',
        position: 'fixed',
        top: 0,
        width: '100%',
        // z-index: 3;
        backgroundColor: '#fff',
        // '& a': {
        //     color: 'gray',
        //     display: 'block',
        //     padding: '1em',
        //     transition: '.2s',
        //     fontFamily: 'Julius Sans One', 
        //     fallbacks:{
        //         fontFamily: 'sans-serif',
        //     },
        // },
    },
    title: {
        fontWeight: 900,
        // display: 'block',
            padding: '1em',
            display: 'inline-block',
        // width:'auto',
        textAlign: 'center',
        'text-transform': 'none',
        fontFamily: 'Ubuntu', 
        fallbacks:{
            fontFamily: 'sans-serif',
        },
        fontSize: '1.1em',
        '@media (min-width: 768px)': {
            fontSize: '1.5em',
        },
        '@media (min-width: 480px)': {
            'text-transform': 'uppercase',
        }
    },
    // authorName: {
    //     color: color.TITLE_AUTHOR,
    // },
    // gameName: {
    //     color: color.TITLE_GAME,
    // },
    // links: {
    //     display: 'flex',
    //     fontWeight: 900,
    //     '& a': {
    //         '&:hover': {
    //             color: color.HEADER_LINK_ACTIVE,
    //         }
    //     },     
    //     fontSize: '1.1em',
    //     '@media (min-width: 768px)': {
    //         fontSize: '1.5em',
    //     }
    // },
    // active: {
    //     color: color.HEADER_LINK_ACTIVE,
    // },
}

const Header = (props) => {
        const classes = props.classes;
        // const isSmall = props.screen.width < 480;
        
        return (
        <div className={classes.nav}>
            <div  className={classes.title}>
            Stock Charts
            </div>
        </div>   
    );
}  



export default injectSheet(styles)(Header);


// Header.propTypes = {
//     classes: PropTypes.object.isRequired,
//     screen: PropTypes.shape({
//         width: PropTypes.number,
//         height: PropTypes.number,
//         ratio: PropTypes.number,
//     })
// };
