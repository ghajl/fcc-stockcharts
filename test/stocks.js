
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server/server';
let expect = chai.expect;

chai.use(chaiHttp);

describe('Stocks operations', function() {
    describe('delete stock', function() {
	    it('remove stock from database and delete stock card', function() {
	        return true
	    });
    });
    describe('add stock', function() {
	    it('should get data from api about existing company', async function() {
	        const res = await chai.request("https://api.iextrading.com/1.0").get('/stock/fb/book')
			expect(res).to.have.status(200);	
	    });
	    it('should get 404 from api about nonexistent company', async function() {
	        const res = await chai.request("https://api.iextrading.com/1.0").get('/stock/qq/book');
	        expect(res).to.have.status(404);
	    });
    });    
});