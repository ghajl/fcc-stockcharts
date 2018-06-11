import getRandomColor from './util/RandomColor';

export default class Stocks {
	constructor(data = []) {
    this.stocks = data.reduce((acc, val) => {
			if (val['symbol'] != null) {
				acc[val['symbol']] = {
					companyName: val['companyName'] || '', 
					color: val['color'] || getRandomColor(),
				}; 
			}
			return acc;
		},{});
  }
}