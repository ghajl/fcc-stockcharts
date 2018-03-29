import mongoose from "mongoose";

const StockSchema = mongoose.Schema({
  symbol: String,
  companyName: String,
});

const Stock = mongoose.model('stock', StockSchema);
export default Stock;