require("babel-polyfill");
import getRandomColor from './util/randomColor';
import {initChart, drawChart} from './chart';
import Card from './components/Card';
import {SYMBOL_ERROR_MESSAGE, REQUEST_ERROR_MESSAGE} from './util/messages';
import {setCards, getCardData, getCardsList, addCardData, deleteCardData} from './cards';
import {getStocksData, addStockData, removeStockData, getHistoricalData, getStockSymbolData} from './helpers';

var socket = io({reconnectionAttempts: 10});

document.addEventListener('DOMContentLoaded', function () {

  const element = {
    input: null,
    progress: null,
    cards: null,
  }
  
  /** Shows message with Bootstrap’s modal */
  function showMessage(message){
      let text = message;
      element.input.value = '';
      
      $('#messageDialog').on('show.bs.modal', function (event) {
          var modal = $(this)
          modal.find('#text').text(text)
      })
      $('#messageDialog').modal();
  }

  function getCardsData(){
    const cards = [...document.querySelectorAll('#controls .fcc-sc-card')];
    return cards.map(card => {
      const symbol = card.id;
      const color = document.querySelector(`#${symbol} .fcc-sc-symbol`).style.color;
      const companyName = document.querySelector(`#${symbol} .fcc-sc-name`).textContent;
      return {symbol, color, companyName};
    });
  }
 
  async function rebuildPage() {
    setProgress(true);
    try{
      const stocksDbData = await getStocksData();
      const stocksPage = Object.keys(getCardsList());
      const stocksDb = Object.keys(stocksDbData);
      const stocksAdd = stocksDb.filter(stock => stocksPage.indexOf(stock) == -1);
      const stocksRemove = stocksPage.filter(stock => stocksDb.indexOf(stock) == -1);
      if (stocksRemove.length !== 0) {
        stocksRemove.forEach(symbol => {
          deleteCardData(symbol);
          const card = document.getElementById(symbol);
          element.cards.removeChild(card);
        })
      }
      if (stocksAdd.length !== 0) {
        stocksAdd.forEach(symbol => {
          const companyName = stocksDbData[symbol];
          addCardData({symbol, companyName});
          addCard(symbol, companyName);
        })
      }
      await createChart();        
    } catch(err) {
      console.log(err);
      showMessage(REQUEST_ERROR_MESSAGE);
      setProgress(false);        
    }
  }

  /**
   *  Removes stock data from db, sends socket event,
   *  removes stock card from DOM and cards list, and redraws chart.
   *  Shows message in case of error. 
   */
  async function removeStock(event) {
    if (event && event.target && event.target.classList.contains('fcc-sc-close')) {
      setProgress(true);
      let symbol = getCardSymbol(event);
      try {
        if (symbol !== '') {
          await removeStockData(symbol, socket);
          await removeCardFromPage(symbol);
          createChart();
        } else throw "Can't get data";
      } catch(err) {
        console.log(err)
        showMessage(REQUEST_ERROR_MESSAGE);
        setProgress(false);            
      }
    }
  }
    
  function getCardSymbol(event){
    return event.target.parentElement.id || '';
  }

  async function removeCardFromPage(symbol){
    return new Promise((resolve) => {
      const card = document.getElementById(symbol); 
      card.className += ' fade';
      setTimeout(() => {
        element.cards.removeChild(card);
        resolve();
      }, 500)
    });
  }

  /**
   *  Checks if the string from input is actually a stock symbol, then adds stock's data - 
   *  symbol and company's name - to database, to the DOM and to the cards list, sends socket event and 
   *  calls redraw of the chart
   */
  async function addStock(e){
    e.preventDefault();
    setProgress(true);
    const input = getInput();
    let companyName = '';
    if (input.trim() === '') {
      element.input.value = '';
      setProgress(false);
      return;
    }
    if(getCardData(input) != null) {
      element.input.value = '';
      setProgress(false);
      return;
    }
    try{
      const {symbol, companyName} = await getStockSymbolData(input);
      await addStockData(symbol, companyName, socket);
      addCard(symbol, companyName);
      createChart();
    } catch(err){
      console.log(err)
      showMessage(SYMBOL_ERROR_MESSAGE);
      setProgress(false);
    }
  }

  function setProgress(isWaiting){
    if (isWaiting) {
      element.progress.className += ' mdl-progress__indeterminate';
    } else {
      element.progress.className = element.progress.className.replace(/\s*mdl-progress__indeterminate/, '');
      element.input.focus();
    }
  }

  function getInput(){
    return element.input.value.toUpperCase();
  }

  function addCard(symbol, companyName){
    const color = getCardData(symbol).color;
    const lastCard = document.querySelector('.fcc-sc-card:last-child');
    const wrapper = document.createElement('div');
    wrapper.innerHTML = Card({symbol, companyName, color});
    const newCard = wrapper.firstChild;
    if (lastCard !== null) {
      element.cards.insertBefore(newCard, lastCard.nextSibling);
    } else {
      element.cards.innerHTML += Card({symbol, companyName, color});
    }
    element.input.value = '';
  }


    /**
     *  Gets json with historically adjusted market-wide data, then builds from this data the object seriesOptions 
     *  for creating Highcharts JS's chart and passes it to function 
     *  that draws the chart.
     *  seriesOptions: [{ name: string ('FB'),
     *                   data: [[number (1365714000000), number (27.4)]],
     *                   color: string ('rgb(43, 181, 45)')}]
     */
    async function createChart(){
        let cards = getCardsList();
        let stockSymbols = Object.keys(cards)
        let seriesOptions = [];
        if(!stockSymbols.length){
            drawChart('chart', seriesOptions) 
            setProgress(false);
        } else {
            try{
                const data = await getHistoricalData(stockSymbols);
                for(let name in data){
                    seriesOptions.push({
                        name: name,
                        data: data[name],
                        color: cards[name].color
                    })
                }
                drawChart('chart', seriesOptions) 
                setProgress(false);
            } catch(err) {
                console.log(err);
                showMessage(REQUEST_ERROR_MESSAGE);
                setProgress(false);
            }
            
        }
    }

    function initPage(){
        setCards(getCardsData());
        setProgress(true);
        initChart();
        createChart();
    }

    
    element.input = document.querySelector('#stock_search input');
    element.progress = document.getElementById('progress');
    element.cards = document.getElementById('controls');
    element.input.focus();
    element.cards.addEventListener('click', removeStock);
    document.getElementById('stock_search').addEventListener('submit', addStock);
    
    initPage();
    socket.on('changesWereMade', rebuildPage);
});









