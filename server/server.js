import express from "express";
import mongoose from "mongoose";
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../../webpack.config.js';
import bodyParser from "body-parser";
import connectMongo from "connect-mongo";
// const favicon = require('express-favicon');
var favicon = require('serve-favicon')
const app = express();
const compiler = webpack(webpackConfig);
const cors = require('cors');
let config = null;
const isDev = process.env.NODE_ENV === "development";
if(isDev) {
    config = require("./config").config;
	app.use(webpackDevMiddleware(compiler, {
	    publicPath: webpackConfig.output.publicPath
	}));
	app.use(webpackHotMiddleware(compiler));
	app.use(cors({
	    origin: 'http://localhost:3000/',
	    credentials: true
	}));
}
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(process.cwd() + '/public'));
// app.use(favicon(__dirname + '/public/favicon.png'));
app.use('/dist', express.static(process.cwd() + '/dist'));
const mongoDB = process.env.MONGOLAB_URI || config.MONGOLAB_URI;
const mongoOptions = {
  useMongoClient: true,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
};
const connect = () => {
	mongoose.connect(mongoDB, mongoOptions, (err, res) => {
		if (err) {
			console.log(`Error connecting`)
		} else {
			console.log(`Successfully connected`)
		}
	});
}
connect();
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error)
db.on("disconnected", connect)




// app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.options('*', cors()) ;

const bundlePath = isDev ? "/bundle.js" : "/dist/bundle.js";
app.all("*", (req, res, next) => {	

	const appHTML = 
	`<!doctype html>
	<html lang="">
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
		<meta name="viewport" content="user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height">
		<link type="text/css" rel="stylesheet" href="public/main.css">
	    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500|Ubuntu"/>
	    
	    <title>freeCodeCamp - Stock Charts</title>
		
	</head>
	<body>
		<div id="root"></div>

		<script src=${bundlePath}></script>
	</body>
	</html>`

	res.status(200).end(appHTML)

})
var port = process.env.PORT || 3000;
app.listen( port, function () {
    console.log('app listening on port ' + port + '\n');
});

		