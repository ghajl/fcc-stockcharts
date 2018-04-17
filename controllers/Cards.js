import getRandomColor from '../util/RandomColor';

var cardList = {};

export function setCards(data = []){
	if(data) cardList = data.reduce((acc, val) => {
		if(val['symbol']){
			acc[val['symbol']] = {
				companyName: val['companyName'] || '', 
				color: val['color'] || getRandomColor()
			}; 
		}
		return acc;
	},{});
	return cardList;
}

export function addCard(card){
	if(card.symbol && cardList[card.symbol] == null){
		let data = {};
		data.companyName = card.companyName || '';
		data.color = card.color || getRandomColor();
		cardList[card.symbol] = data;
		
	}
	
}

export function getCard(symbol){
	return cardList[symbol] ? {symbol: symbol, companyName: cardList[symbol].companyName,  color: cardList[symbol].color} : null;
}

export function removeCard(symbol){
	delete cardList[symbol];
}

export function getCards(){
	return cardList;
}