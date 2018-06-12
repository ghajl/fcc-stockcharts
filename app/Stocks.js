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

  addStock(symbol, companyName) {
    if (typeof this.stocks[symbol] === 'undefined'){
      const data = {};
      data.companyName = companyName;
      data.color = getRandomColor();
      this.stocks[symbol] = data;
    }
  }

  removeStock(symbol) {
    delete this.stocks[symbol];
  }

  getStockData(symbol) {
    return typeof this.stocks[symbol] !== 'undefined'
      ? {
          symbol, 
          companyName: this.stocks[symbol].companyName,  
          color: this.stocks[symbol].color
        } 
      : null;
  }

  getAll() {
    return this.stocks;
  }
}
