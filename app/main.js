import '../scss/main.scss';
import vex from 'vex-js';
import vexDialog from 'vex-dialog';
import {random as getRandomColor} from './util/colorGenerator';
import {initChart, drawChart} from './chart';
import renderCard from './components/Card';
import { getStockSymbolData } from './util/api';
import {SYMBOL_ERROR_MESSAGE, REQUEST_ERROR_MESSAGE} from './util/message';
import db from './util/db';
import Stocks from './util/Stocks';

document.addEventListener('DOMContentLoaded', function () {

  const element = {
    input: {
      node: null,

      getValue() {
        return this.node.value.toUpperCase();
      },
      setValue(value) {
        this.node.value = value;
      },
      setFocus() {
        this.node.focus();
      },
    },
    
    
    progress: {
      node: null,
      
      activate() {
        this.node.className += ' mdl-progress__indeterminate';
      },
      
      stop() {
        this.node.className = this.node.className.replace(/\s*mdl-progress__indeterminate/, '');
      },
    },
    
    
    cardsContainer: {
      node: null,

      addCard(symbol, companyName){
        const color = localStocks.getStockData(symbol).color;
        const lastCard = document.querySelector('.card:last-child');
        const wrapper = document.createElement('div');
        wrapper.innerHTML = renderCard({symbol, companyName, color});
        const newCard = wrapper.firstChild;
        if (lastCard !== null) {
          this.node.insertBefore(newCard, lastCard.nextSibling);
        } else {
          this.node.innerHTML += renderCard({symbol, companyName, color});
        }
        element.input.setValue('');
      },

      async removeCard(symbol) {
        return new Promise((resolve) => {
          const card = document.getElementById(symbol); 
          card.className += ' fade';
          setTimeout(() => {
            this.node.removeChild(card);
            resolve();
          }, 200)
        });
      },
    },

    dialog: {
      show(message) {
        element.input.setValue('');
        vex.dialog.alert({
          message,
          afterClose: () => {
            element.input.setFocus();
          }
        });
      }
    }
  }

  /**
   *  Checks if the string from input is actually a stock symbol, then adds stock's data - 
   *  symbol and company's name - to database, to the DOM and to the cards list, sends socket event and 
   *  calls redraw of the chart
   */
  async function addStock(e){
    e.preventDefault();
    element.progress.activate();
    const input = element.input.getValue();
    let companyName = '';
    if (input.trim() === '' || localStocks.getStockData(input) != null) {
      element.progress.stop();
      element.input.setValue('');
      element.input.setFocus();
      return;
    }
    try{
      const {symbol, companyName, historicalData} = await getStockSymbolData(input);
      await db.addStock(symbol, companyName, historicalData, socket);
      localStocks.addStock(symbol, companyName, historicalData);
      element.cardsContainer.addCard(symbol, companyName);
      createChart();
    } catch(err){
      console.log(err)
      element.dialog.show(SYMBOL_ERROR_MESSAGE);
      element.progress.stop();
    }
  }
  
  /**
   *  Removes stock data from db, sends socket event,
   *  removes stock card from DOM and cards list, and redraws chart.
   *  Shows message in case of error. 
   */
  async function removeStock(event) {
    if (event && event.target && event.target.classList.contains('close')) {
      element.progress.activate();
      let symbol = getCardSymbol(event);
      try {
        if (symbol !== '') {
          await db.removeStock(symbol, socket);
          localStocks.removeStock(symbol);
          await element.cardsContainer.removeCard(symbol);
          createChart();
        } else throw "Can't get data";
      } catch(err) {
        console.log(err)
        element.dialog.show(REQUEST_ERROR_MESSAGE);
        element.progress.stop();   
      }
    }
  }

  async function rebuildPage() {
    element.progress.activate();
    try{
      const stocksDbData = await db.getStocks();
      const stocksPage = Object.keys(localStocks.getAll());
      const stocksDb = Object.keys(stocksDbData);
      const stocksAdd = stocksDb.filter(stock => stocksPage.indexOf(stock) == -1);
      const stocksRemove = stocksPage.filter(stock => stocksDb.indexOf(stock) == -1);
      if (stocksRemove.length !== 0) {
        stocksRemove.forEach(async (symbol) => {
          localStocks.removeStock(symbol);
          await element.cardsContainer.removeCard(symbol);
        })
      }
      if (stocksAdd.length !== 0) {
        stocksAdd.forEach(symbol => {
          const companyName = stocksDbData[symbol];
          localStocks.addStock(symbol, companyName);
          element.cardsContainer.addCard(symbol, companyName);
        })
      }
      await createChart();        
    } catch(err) {
      console.log(err);
      element.dialog.show(REQUEST_ERROR_MESSAGE);
      element.progress.stop();  
    }
  }

  /**
   *  Gets json with historically adjusted market-wide data, then builds from this data the object seriesOptions 
   *  for creating Highcharts JS's chart and passes it to function 
   *  that draws the chart.
   *  seriesOptions: [{ name: string ('FB'),
   *                   data: [[number (1365714000000), number (27.4)]],
   *                   color: string ('rgb(43, 181, 45)')}]
   */
  async function createChart() {
    const stockList = localStocks.getAll();
    const stockSymbols = Object.keys(stockList);
    const seriesOptions = [];
    if (!stockSymbols.length) {
      drawChart('chart', seriesOptions) 
      element.progress.stop();
      element.input.setFocus();
    } else {
      try{
        // const data = await getHistoricalData(stockSymbols);
        for (let name in stockList) {
          if (stockList[name] != null) {
            seriesOptions.push({
              name: name,
              data: stockList[name].historicalData,
              color: stockList[name].color
            })  
          }
        }
        drawChart('chart', seriesOptions) 
        element.progress.stop();
        element.input.setFocus();
      } catch(err) {
        console.log(err);
        element.dialog.show(REQUEST_ERROR_MESSAGE);
        element.progress.stop();
      }
    }
  }

  function getCardsData(){
    const cards = [...document.querySelectorAll('#stock_cards .card')];
    return cards.map(card => {
      const symbol = card.id;
      const color = document.querySelector(`#${symbol} .symbol`).style.color;
      const companyName = document.querySelector(`#${symbol} .company_name`).textContent;
      return {symbol, color, companyName};
    });
  }
    
  function getCardSymbol(event){
    return event.target.parentElement.parentElement.id || '';
  }

  function initPage(){
    element.progress.activate();
    initChart();
    createChart();
  }

  
  element.input.node = document.querySelector('#stock_search input');
  element.progress.node = document.getElementById('progress');
  element.cardsContainer.node = document.getElementById('stock_cards');

  element.cardsContainer.node.addEventListener('click', removeStock);
  document.getElementById('stock_search').addEventListener('submit', addStock);
  
  vex.registerPlugin(vexDialog);
  vex.defaultOptions.className = 'vex-theme-os';
  
  const socket = io({reconnectionAttempts: 10});
  socket.on('update', rebuildPage);

  const initialStocks = window.initialState;
  delete window.initialState;
  const localStocks = new Stocks(initialStocks);

  initPage();

  element.input.setFocus();
  
});
