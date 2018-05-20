require("babel-polyfill");
import getRandomColor from './util/RandomColor';
import {initChart, drawChart} from './chart';
import Card from './components/Card';
import {SYMBOL_ERROR_MESSAGE, REQUEST_ERROR_MESSAGE} from './util/Messages';
import {setCards, getCard, getCards, addCard, removeCard} from './cards';
import {getStocksData, addStockData, removeStockData, getHistoricalData, getStockSymbolData} from './helpers';

var socket = io({reconnectionAttempts: 10});

$(function () {
    
    initPage();

    $('#controls').on("click", ".fcc-sc-close", removeStock);

    $('#buttonSearch').on("click", addStock);

    $('#formSearch').on("submit", addStock);

    socket.on('changesWereMade', rebuildPage);


    /** Shows message with Bootstrap’s modal */
    function showMessage(message){
        let text = message;
        $('.fcc-sc-search-bar input').val('');
        
        $('#messageDialog').on('show.bs.modal', function (event) {
            var modal = $(this)
            modal.find('#text').text(text)
        })
        $('#messageDialog').modal();
    }



    function getCardsData(){
        return $('#controls .fcc-sc-card').map(function(){
            return { symbol: $(this).attr('id'),
                    color: $(this).find('.fcc-sc-symbol')[0].style.color,
                    companyName: $(this).find('.fcc-sc-name').text()
                }
        }).get();
    }
    
    function initPage(){
        setCards(getCardsData());
        setProgress(true);
        initChart();
        createChart();
    }


    async function rebuildPage() {
        setProgress(true);
        try{

            
            let stocksFromDb = await getStocksData();
            let stocksOnPage = Object.keys(getCards());
            let stocksFromDbNames = Object.keys(stocksFromDb);
            let cardsToAdd = stocksFromDbNames.filter(stock => stocksOnPage.indexOf(stock) == -1);
            let cardsToRemove = stocksOnPage.filter(stock => stocksFromDbNames.indexOf(stock) == -1);
            if(cardsToRemove.length){
                cardsToRemove.forEach(name => {
                    removeCard(name);
                    $(`#${name}`).remove();
                })
            }
            if(cardsToAdd.length){
                cardsToAdd.forEach(symbol => {
                    addCard({symbol, companyName: stocksFromDb[symbol]});
                    let color = getCard(symbol).color;
                    let element = $('.fcc-sc-card:last-child');
                    if(element.length){
                        element.after(Card({symbol, companyName: stocksFromDb[symbol], color}));
                    } else {
                        $('#controls').append(Card({symbol, companyName: stocksFromDb[symbol], color}));
                    }
                })
                
            }
            await createChart();        
        } catch(err) {
            console.log(err);
            showMessage(REQUEST_ERROR_MESSAGE);
            setProgress(false);        
        }
    };



    /**
     *  Removes stock data from db, sends socket event,
     *  removes stock card from DOM and cards list, and redraws chart.
     *  Shows message in case of error. 
     */
    async function removeStock(e) {
        setProgress(true);
        let symbol = getCardSymbol(e);
        try{
            if(symbol){
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
    
    function getCardSymbol(event){
        return event && event.currentTarget && event.currentTarget.parentElement && event.currentTarget.parentElement.id || '';
    }

    async function removeCardFromPage(symbol){
        await $(`#${symbol}`).fadeOut('fast', 'linear').promise();
        $(`#${symbol}`).remove();
    }
    /**
     *  Checks if the string from input is actually a stock symbol, then adds stock's data - 
     *  symbol and company's name - to database, to the DOM and to the cards list, sends socket event and 
     *  calls redraw of the chart
     */
    async function addStock(e){
        e.preventDefault();
        setProgress(true);
        let input = getInput()
            , companyName = '';
        if(input.trim() === ''){
            $('.fcc-sc-search-bar input').val('')
            setProgress(false);
            return;
        }
        
        if(getCard(input) != null) {
            $('.fcc-sc-search-bar input').val('')
            setProgress(false);
            return;
        }
        
        try{
            const {symbol, companyName} = await getStockSymbolData(input);
            await addStockData(symbol, companyName, socket);
            addCompanyCardToPage(symbol, companyName);
            createChart();
            
        } catch(err){
            console.log(err)
            showMessage(SYMBOL_ERROR_MESSAGE);
            setProgress(false);
        }
    }

    function setProgress(isWaiting){
        if(isWaiting) $('#progress').addClass('mdl-progress__indeterminate');
        else $('#progress').removeClass('mdl-progress__indeterminate');
    }



    function getInput(){
        return $('.fcc-sc-search-bar input').val().toUpperCase();
    }

    function addCompanyCardToPage(symbol, companyName){
        let color = getCard(symbol).color;
        let element = $('.fcc-sc-card:last-child');
        if(element.length){
            element.after(Card({symbol, companyName, color}));
        } else {
            $('#controls').append(Card({symbol, companyName, color}));
        }
         
        $('.fcc-sc-search-bar input').val('');
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
        let cards = getCards();
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

});









