import axios from 'axios';

export async function getStockSymbolData(input){

  const symbolSearchUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${input}&apikey=VGMKMSL15G63LSFK`;
  const timeSeriesDataUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${input}&apikey=VGMKMSL15G63LSFK`;
  let symbol = '', companyName = '', historicalData = [];
  
  const { data: symbolData } = await axios(symbolSearchUrl);
  if (symbolData['bestMatches'] 
    && symbolData['bestMatches'].length 
    && symbolData['bestMatches'][0]['1. symbol']
    && symbolData['bestMatches'][0]['1. symbol'] === input) {
    symbol = symbolData['bestMatches'][0]['1. symbol'];
    if (symbolData['bestMatches'][0]['2. name']) {
      companyName = symbolData['bestMatches'][0]['2. name'];  
    }  
    const { data: timeSeriesData } = await axios(timeSeriesDataUrl);
    const timeSeries = timeSeriesData['Time Series (Daily)'];
    const dates = Object.keys(timeSeries).sort((a,b) => {
      return a > b ? 1 : a < b ? -1 : 0;
    });
    historicalData = dates.map(date => {
      let year = +date.slice(0,4);
      let month = +date.slice(5,7) - 1;
      let day = +date.slice(8);
      let current = new Date(year, month, day, 0, 0);
      let price = timeSeries[date]['4. close'];
      return [current.getTime(), +price]
    })
  }
  return {symbol, companyName, historicalData};
}
