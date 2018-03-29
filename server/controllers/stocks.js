import Stock from '../models/stock';

export function getStocks(req, res, next) {
	Stock.find( {}, 'symbol companyName', (err, docs) => {
		if (err) {
			return res.sendStatus(401);
		}
		return res.json({data: docs});
	} )
	
}

export function updateStocks(req, res, next){
	if(req.body.operation === 'ADD') return	addStock(req, res, next);
	if(req.body.operation === 'REMOVE') return	removeStock(req, res, next);
}

function addStock(req, res, next) {
	const newStock = new Stock({
	    symbol: req.body.symbol,
	    companyName: req.body.companyName
	});	
	Stock.findOne({ symbol: req.body.symbol }, (err, stock) => {
		
		// create the new stock
		if(!stock) {
			// console.log(newStock);
                // console.log(companyName);
			newStock.save((err, user) => {
				if (err) {
					
					return res.sendStatus(401);
				}
				return getStocks(req, res, next)
			})
		}
	})

}

function removeStock(req, res, next){
	Stock.remove({ symbol: req.body.symbol }, (err, stock) => {
		console.log(stock)
		// create the new stock
		if(err) {
				return res.sendStatus(401);
		}
		return getStocks(req, res, next)
	
	})
}