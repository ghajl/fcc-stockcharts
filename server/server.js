import express from "express";
import https from "https";
import mongoose from "mongoose";
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../../webpack.config.js';
import bodyParser from "body-parser";
import connectMongo from "connect-mongo";
import {renderPage} from './index';
import {getStocks, updateStocks} from './controllers/stocks'
// const favicon = require('express-favicon');
// var favicon = require('serve-favicon')
const app = express();
const compiler = webpack(webpackConfig);
const cors = require('cors');
// const server = require('http').Server(app);

var port = process.env.PORT || 3000;

const server = app.listen( port, function () {
    console.log('app listening on port ' + port + '\n');
});
const io = require('socket.io')(server);
// server.listen(80);
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
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(process.cwd() + '/public'));
// app.use(favicon(__dirname + '/public/favicon.png'));
app.use('/dist', express.static(process.cwd() + '/dist'));
app.use('/js', express.static(process.cwd() + '/js'));
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




io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

// app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.options('*', cors()) ;
app.get("/data", getStocks);
app.post("/data", updateStocks);
// app.route('/')
//     .get(function(req, res) {
// 		  res.sendFile(process.cwd() + '/views/index.html');
//     })

app.route('/')
    .get(renderPage);
// const bundlePath = isDev ? "/bundle.js" : "/dist/bundle.js";
// app.all("*", (req, res, next) => {	

// 	const appHTML = 
// 	`<!doctype html>
// 	<html lang="">
// 	<head>
// 		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
// 		<meta name="viewport" content="user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height">
// 		<link type="text/css" rel="stylesheet" href="public/main.css">
// 	    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500|Ubuntu"/>
// 	    <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png">
// 		<link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png">
// 		<link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png">
// 		<link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png">
// 		<link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png">
// 		<link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png">
// 		<link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png">
// 		<link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png">
// 		<link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png">
// 		<link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png">
// 		<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
// 		<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
// 		<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
// 		<link rel="manifest" href="/manifest.json">
// 		<meta name="msapplication-TileColor" content="#ffffff">
// 		<meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
// 		<meta name="theme-color" content="#ffffff">
// 	    <title>freeCodeCamp - Stock Charts</title>
		
// 	</head>
// 	<body>
// 		<div id="root"></div>

// 		<script src=${bundlePath}></script>
// 	</body>
// 	</html>`

// 	res.status(200).end(appHTML)

// })


		