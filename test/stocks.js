
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let expect = chai.expect;

chai.use(chaiHttp);

describe('Stocks operations', function() {
    describe('delete stock', function() {
	    it('should remove stock from database, emit socket message and delete stock card', function() {
	      
	    });
    });
});