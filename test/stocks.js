
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server/server';
import chaiAsPromised from 'chai-as-promised';
import { SocketIO, Server } from 'mock-socket';
import {getStockSymbolData, addStockData} from '../../js/helpers';
import mongoose from 'mongoose';
import Stock from '../server/models/stock';
import {setCards, getCard, getCards, addCard, removeCard} from '../controllers/Cards';


chai.use(chaiHttp);
chai.use(chaiAsPromised);
chai.should();
let expect = chai.expect;


describe('Stocks operations', () => {
	
	const mockServer = new Server('http://localhost:3000');
    
    mockServer.on('connection', server => {
        mockServer.on('changesWereMade', () => {
		    mockServer.broadcast.emit('changesWereMade');
	    });
	});
    
    window.io = SocketIO;
    const socket = window.io();
    // describe('delete stock', function() {
	   //  it('remove stock from database and delete stock card', function() {
	   //      return true
	   //  });
    // });
    describe('add stock', () => {
	    it('should get stock symbol and company name from api given correct input', async () =>{
	    	
    		const res = await getStockSymbolData('fb');
			expect(res).to.eql({symbol: 'FB', companyName: 'Facebook Inc.'});
	    		
	    });
	    it('request should fail for nonexistent stock symbol', async () => {
	        await getStockSymbolData('qq').should.be.rejected;
	        
	    });
	    
	    it('should add company name and stock symbol to db',  async () => {
	    	await clearDb();
	    	const symbol = 'FB', companyName = 'Facebook Inc.';
	    	const fb = new Stock({
			    symbol,
			    companyName
			});	
			
			await chai.request(server).post('/data').send({operation: 'ADD', symbol, companyName});
			const res = await findInDb(symbol);
			expect(res).to.not.be.empty;
			expect(res).to.include({symbol: symbol, companyName: companyName});
			
			
	    	
	    })
    });    
});

async function clearDb(){
	return new Promise((resolve, reject) => {
		Stock.remove({},(err) => {
    		if(err) reject(err);
    		resolve();
    	})
	})
}

async function findInDb(symbol){
	return new Promise((resolve, reject) => {
		Stock.findOne({ symbol: symbol }, (err, stock) => {
		
			if(err) reject(err);
			if(stock) {
				resolve(stock);
			} else resolve({});
		})
	})
}