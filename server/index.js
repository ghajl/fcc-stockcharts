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
	// passport.authenticate("local", function(err, user, info) {		
	// 	if(err) return next(err)
	// 	if(!user) {
	// 		return res.sendStatus(401);		
	// 	}
	// 	req.logIn(user, loginErr => {
	// 		if(loginErr) {
	// 			return res.sendStatus(401);
	// 		}
	// 		return  res.json({places:user.places});
	// 	})
	// })(req, res, next)

	
	Stock.find( {}, 'symbol companyName', (err, docs) => {
			
		// if(docs){
		// 	let symbols = docs.map(s => s['symbol']).join(',');
		// 	const url =
		// 		  // "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=" + alphavantage_key;
		// 		  "https://api.iextrading.com/1.0/stock/market/batch?symbols=" + symbols + "&types=quote,chart&range=1d&filter=symbol,companyName,date,minute,average"
		// 		https.get(url, res => {
		// 		    res.setEncoding("utf8");
		// 		    let body = "";
		// 		    res.on("data", data => {
		// 			    body += data;
		// 		    });
		// 		    res.on("end", () => {
		// 			    body = JSON.parse(body);
		// 			    let chartsData = {};
		// 			    for(let name in body){
		// 			    	if(body[name].chart) chartsData[name] = body[name].chart.map(data => {
		// 			    		if(data.date){
		// 			    			let year = +data.date.slice(0,4);
		// 			    			let month = +data.date.slice(4,6);
		// 			    			let day = +data.date.slice(6);
		// 			    			let hour = 0;
		// 			    			let minute = 0;
		// 			    			if(data.minute){
		// 			    				hour = +data.minute.slice(0, 2);
		// 			    				minute = +data.minute.slice(3);
		// 			    			}
		// 			    			let current = new Date(year, month, day, hour, minute);//.getUTCMilliseconds();
					    			
		// 			    			let currentAverage = 0;
		// 			    			if(data.average){
		// 			    				currentAverage = data.average;
		// 			    			}
		// 			    			return [current.getTime(), currentAverage]
		// 			    		} else {
		// 			    			return [0,0];
		// 			    		}
					    		
		// 			    	})
		// 				}	
		// 				// console.log(chartsData);
							
		// 				const appHTML = makePage(docs, chartsData);
						
		// 			});
		// 	});
		// } else {
		// 	const appHTML = makePage([]);
		// }
		const appHTML = makePage(docs);
		response.status(200).end(appHTML);
	} )
	// let getStocks = Stock.find().exec();
	// let getSymbols = Stock.find().exec();

	// getSymbols.then(results => )
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
// console.log(appHTML)
	return appHTML;
	
}

// function Card(data){
// 	// console.log(data)
// 	// var cssHSL = "hsl(" + 360 * Math.random() + ',' +
//  //                 (40 + 50 * Math.random()) + '%,' + 
//  //                 (40 + 10 * Math.random()) + '%)';
// 	const cssHSL = getRandomColor();
// 	const element = `<div id=${data.symbol} class="card">
// 						<div class="label">
// 						<div class="symbol" style="color: ${cssHSL}">${data.symbol}</div>
// 						<div class="name">${data.name}</div>
// 						</div>
// 						<div class="close"><i class="material-icons md-18 gray">close</i></div>
// 					</div>`;
// 	return element;
// }


function SearchBar(){
	const element = `<div class='search-bar'>
						<form>
						<input type="text" placeholder="Enter symbol here.." name="search">
						<button type="button">Submit</button>
						<form>
					</div>`;

	return element;
}
// style="border: 2px solid ${cssHSL}"
// <i class="material-icons">search</i>