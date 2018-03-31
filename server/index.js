import Stock from './models/stock';
import https from "https";
import getRandomColor from '../util/RandomColor';
import Card from '../components/Card';

let config = null;
const isDev = process.env.NODE_ENV === "development";
if(isDev) {
    config = require("./config").config;
}

const alphavantage_key = process.env.ALPHAVANTAGE_KEY || config.ALPHAVANTAGE_KEY;

export function renderPage(request, response, next) {
	
	Stock.find( {}, 'symbol companyName', (err, docs) => {
		const appHTML = makePage(docs);
		response.status(200).end(appHTML);
	} )
}

function makePage(symbols, chartsData){

	let stocks = [];
	if(symbols) stocks = symbols.map(s => ({symbol: s['symbol'], name: s['companyName']}));
	

	const appHTML = 
	String.raw`<!doctype html>
	<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>freeCodeCamp - Stock Charts</title>
        <meta name="description" content="">
        <meta name="viewport" content="user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height">

        <link rel="manifest" href="site.webmanifest">
        <link rel="apple-touch-icon" href="icon.png">
        

        <link rel="stylesheet" type="text/html" href="public/normalize.css">
        <link rel="stylesheet" type="text/css" href="public/main.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500|Ubuntu"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
		<link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.deep_purple-amber.min.css">
		<script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
    </head>
    <body>
        
        <header class="header">
            <div  class="title">
                Stock Charts
            </div>
        
        </header>
        <div class="content">
        <div class="chart-wrapper">
        <div class="search">
        ${SearchBar()}
        </div>
        <div id="chart"></div>

		<div id="progress" class="mdl-progress mdl-js-progress" style="width: 100%"></div>
        </div>
        <div id="controls">
        ${stocks.map(v => Card(v)).join('')}
        </div>
	 </div>
        <footer>
        
            <div class="container">
                <div class="element">
                    <div class="link">
                        <div>
                            <a href="https://github.com/ghajl/fcc-nightlife" target="_blank" class="a">
                            <div class="item">
                                <svg class="icon">
                                    <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                                </svg>
                                
                            </div>
                            </a>
                        </div>    
                    </div>
                </div>
                <div class="element">
                    <div class="link">
                        <div>
                            <a href="mailto:michaelknn@gmail.com?subject=Mail from BC" target="_blank"  class="a">
                            <div class="item">
                                <svg class="icon">
                                    <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                                </svg>
                                
                            </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        
        </footer>

        <script src="/socket.io/socket.io.js"></script>
        <script src="https://code.highcharts.com/stock/highstock.js"></script>
        <script src="https://code.highcharts.com/stock/modules/exporting.js"></script>
        <script src="/js/vendor/modernizr-3.5.0.min.js"></script>
        <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-3.2.1.min.js"><\/script>')</script>
        <script src="/bundle.js"></script>

        
    </body>
	</html>`
	return appHTML;
	
}

function SearchBar(){
	const element = `<div class='search-bar'>
						<form>
						<input type="text" placeholder="Enter symbol here.." name="search">
						<button type="button">Submit</button>
						<form>
					</div>`;

	return element;
}
