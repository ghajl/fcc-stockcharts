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
    socket.on('changesWereMade', function () {
	    socket.broadcast.emit('changesWereMade');
    });
});

// app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.options('*', cors()) ;
app.get("/data", getStocks);
app.post("/data", updateStocks);

app.route('/')
    .get(renderPage);
