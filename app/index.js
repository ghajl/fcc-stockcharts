import https from 'https';
import Stock from '../server/models/stock';
import Card from './components/Card';
import IconLink from './components/IconLink';
import Stocks from './util/Stocks';

let config = null;
const isDev = process.env.NODE_ENV === 'development';
if (isDev) {
  config = require('../server/config').config;
}
const bundlePath = '/dist/bundle.js';

function makePage(symbols){
  let stocks = [];
  if (symbols) {
    stocks = Object.keys(symbols).map(s => (
      {
        symbol: s, 
        companyName: symbols[s]['companyName'], 
        color: symbols[s]['color']
      }
    ));
  }
  const git = {
    href: 'https://github.com/ghajl/fcc-stockcharts',
    svgPath: 'M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z',
  }
  const email = {
    href: 'mailto:michaelmsky@gmail.com?subject=Mail from SC',
    svgPath: 'M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z',
  }
  const appHTML = 
  String.raw`<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>freeCodeCamp - Stock Charts</title>
      <meta name="description" content="FreeCodeCamp project. Express, webpack, socket.io, mongodb">
      <meta name="viewport" content="user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height">
      
      <link rel="shortcut icon" type="image/x-icon" href="public/favicon.ico">
      

      <link rel="stylesheet" type="text/css" href="dist/main.css">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500|Ubuntu">
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
      <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.deep_purple-amber.min.css">
      <link rel="stylesheet" href="vendor/css/vex.css">
      <link rel="stylesheet" href="vendor/css/vex-theme-os.css">
      <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
    </head>
    <body>
      
        <div class="fcc-sc-header">
          <div  class="fcc-sc-title">
            Stock Charts
          </div>
        
        </div>
        <div class="fcc-sc-content">
        <div class="chart-wrapper">
          <div class="fcc-sc-search">
            <div class='fcc-sc-search-bar'>
              <form id="stock_search">
                <input type="text" placeholder="Enter symbol here.." name="search">
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
          <div id="chart"></div>

          <div id="progress" class="mdl-progress mdl-js-progress" style="width: 100%"></div>
        </div>
        <div id="controls">
          ${stocks.map(v => Card(v)).join('')}
        </div>
      </div>
      <footer>
        
        <div class="fcc-sc-container">
          ${IconLink(git)}
          ${IconLink(email)}
        </div>
        
      </footer>

      <script src="/socket.io/socket.io.js"></script>
      <script src="https://code.highcharts.com/stock/highstock.js"></script>
      <script src="https://code.highcharts.com/stock/modules/exporting.js"></script>
      <script src=${bundlePath}></script>

        
    </body>
  </html>
  `
  return appHTML;
}

export default function renderPage(request, response, next) {
  Stock.find( {}, 'symbol companyName', (err, docs) => {
    const dbStocks = new Stocks(docs);
    const cardsData = dbStocks.getAll();
    const appHTML = makePage(cardsData);
    response.status(200).end(appHTML);
  } )
}
