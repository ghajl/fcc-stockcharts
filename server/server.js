require('babel-polyfill');
import express from 'express';
import https from 'https';
import mongoose from 'mongoose';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../../webpack.config.js';
import {renderPage} from '../app/index';
import {getStocks, updateStocks} from './controllers/stocks'
const app = express();
const compiler = webpack(webpackConfig);
const cors = require('cors');

var port = process.env.PORT || 3000;

const server = app.listen( port, function () {
    console.log('app listening on port ' + port + '\n');
});
const io = require('socket.io')(server);

let config = null;
const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
if(isDev) {
    config = require('./config').config;
	app.use(webpackDevMiddleware(compiler, {
	    publicPath: webpackConfig.output.publicPath
	}));
	app.use(webpackHotMiddleware(compiler));
	app.use(cors({
	    origin: 'http://localhost:3000/',
	    credentials: true
	}));
}
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/dist', express.static(process.cwd() + '/dist'));
app.use('/js', express.static(process.cwd() + '/js'));

let mongoDB;

if(process.env.NODE_ENV === 'test'){
	mongoDB = config.MONGOLAB_URI_TEST;
} else {
	mongoDB = process.env.MONGOLAB_URI || config.MONGOLAB_URI
}
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
db.on('error', console.error)
db.on('disconnected', connect)




io.on('connection', function (socket) {
    socket.on('changesWereMade', function () {
	    socket.broadcast.emit('changesWereMade');
    });
});

// app.use(require('cookie-parser')());
//use json() for axios
app.use(require('body-parser').json());
app.options('*', cors()) ;
app.get('/data', getStocks);
app.post('/data', updateStocks);

app.route('/')
    .get(renderPage);
export default app;