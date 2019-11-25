import {random as getRandomColor} from './colorGenerator';

export default class Stocks {
  constructor(data = []) {
    this.stocks = data.reduce((acc, val) => {
      if (val['symbol'] != null) {
        acc[val['symbol']] = {
          companyName: val['companyName'] || '', 
          historicalData: val['historicalData'] || '', 
          color: val['color'] || getRandomColor(),
        }; 
      }
      return acc;
    },{});
  }

  addStock(symbol, companyName, historicalData) {
    if (typeof this.stocks[symbol] === 'undefined'){
      const data = {};
      data.companyName = companyName;
      data.historicalData = historicalData;
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
          historicalData: this.stocks[symbol].historicalData, 
          color: this.stocks[symbol].color
        } 
      : null;
  }

  getAll() {
    return this.stocks;
  }
}
