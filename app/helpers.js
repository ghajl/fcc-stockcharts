import axios from 'axios';
import {addCardData, deleteCardData} from './cards';
/**
 *  Acquire a json file
 *  from iextrading api's https://api.iextrading.com/1.0/stock/<symbol>/book
 */
export async function getStockSymbolData(input){

  const url = `https://api.iextrading.com/1.0/stock/${input}/book`;
  let symbol = '', companyName = '';
  
  const {data} = await axios(url);
  
  if(data.quote && data.quote.symbol){
    symbol = data.quote.symbol;
    if(data.quote.companyName) companyName = data.quote.companyName;    
  }
  return {symbol, companyName};
}


/**
 *  Gets json from iextrading's api -  
 *  https://api.iextrading.com/1.0/stock/market/batch?symbols=<comma separated stock symbols>&types=quote,chart&range=5y&filter=symbol,companyName,date,minute,closewith five years data 
 *  that is five years historically adjusted market-wide data containing stock symbol, company name, date, time and close price.
 *  @param {string[]} symbols
 *  @returns {Object.<string, [number, number][]>} chartsData
 */
export async function getHistoricalData(symbols){
  let symbolsNames = symbols.join(',');
  const url = `https://api.iextrading.com/1.0/stock/market/batch?symbols=${symbolsNames}&types=quote,chart&range=5y&filter=symbol,companyName,date,minute,close`;
  
  const {data} = await axios(url);
  const chartsData = {};
  for(let name in data){
    if(data[name].chart) chartsData[name] = data[name].chart.map(data => {
      if(data.date){
        let year = +data.date.slice(0,4);
        let month = +data.date.slice(5,7) - 1;
        let day = +data.date.slice(8);
        let hour = 0;
        let minute = 0;
        if(data.minute){
          hour = +data.minute.slice(0, 2);
          minute = +data.minute.slice(3);
        }
        let current = new Date(year, month, day, hour, minute);
            
        let price = 0;
        if(data.close){
         price = data.close;
        }
        return [current.getTime(), price]
      } else {
        return [0,0];
      }
            
    })
  }
  return chartsData;
}


export async function removeStockData(symbol, socket){
  await axios.post('/data', {operation: 'REMOVE', symbol});
  deleteCardData(symbol);
  socket.emit('update');
}

export async function addStockData(symbol, companyName, socket){
  await axios.post('/data', {operation: 'ADD', symbol, companyName});
  addCardData({symbol, companyName});
  socket.emit('update');
}

export async function getStocksData(){
  const docs = await axios.get('/data');
  return docs.data.data.reduce((acc, company) => {acc[company.symbol] = company.companyName; return acc }, {})        
}