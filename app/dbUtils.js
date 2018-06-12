import axios from 'axios';

const dbUtils = {
  removeStock: async (symbol, socket) => {
    await axios.post('/data', {operation: 'REMOVE', symbol});
    socket.emit('update');
  },

  addStock: async (symbol, companyName, socket) => {
    await axios.post('/data', {operation: 'ADD', symbol, companyName});
    socket.emit('update');
  },

  getStocks: async () => {
    const docs = await axios.get('/data');
    return docs.data.data.reduce((acc, company) => {acc[company.symbol] = company.companyName; return acc }, {})        
  },
}

export default dbUtils;
