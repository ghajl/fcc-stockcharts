import getRandomColor from '../util/RandomColor';
import {initChart, drawChart} from './chart';
import Card from '../components/Card';
import {SYMBOL_ERROR_MESSAGE, REQUEST_ERROR_MESSAGE} from '../util/Messages';
import {setCards, getCard, getCards, addCard, removeCard} from '../lib/controllers/Cards';

$(function () {
    
    initPage();

    $('#controls').on("click", ".fcc-sc-close", removeStock);

    $('.fcc-sc-search-bar form button').on("click", addStock);

    $('.fcc-sc-search-bar form').on("submit", addStock);

    var socket = io();
    socket.on('changesWereMade', function () {
        setProgress(true);
        $.get('/data', function(docs){
            let stocksFromDb = docs.data.reduce((acc, company) => {acc[company.symbol] = company.companyName; return acc }, {})
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
            setTimeout(createChart, 1000);
        }).fail(function() {
            showMessage(REQUEST_ERROR_MESSAGE);
            setProgress(false);
        });
    });




    function initPage(){
        setCards(getCardsData());
        setProgress(true);
        initChart();
        createChart();
    }

    /** Shows message with Bootstrap’s JavaScript modal plugin */
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


    /**
     *  Removes stock data from db, then sends socket event,
     *  removes stock card from DOM and cards list, and redraws chart.
     *  Shows message in case of error. 
     */
    function removeStock(e) {
        setProgress(true);
        let symbol = getCardSymbol(e);
        if(symbol){
            $.post('/data', {operation: 'REMOVE', symbol}, function(docs){
                        socket.emit('changesWereMade');
                        $(`#${symbol}`).fadeOut('fast', "linear", function(){
                            removeCard(symbol);
                            $(`#${symbol}`).remove();
                            createChart();
                        }) 
                        
                                           
                    }).fail(function() {

                        showMessage(REQUEST_ERROR_MESSAGE);
                        setProgress(false);
                    });
        } else {
            showMessage(REQUEST_ERROR_MESSAGE);
            setProgress(false);
        }
    }
    
    function getCardSymbol(event){
        return event && event.currentTarget && event.currentTarget.parentElement && event.currentTarget.parentElement.id || '';
    }
    

    /**
     *  Checks if the string from input is actually a stock symbol by acquiring a json file
     *  from iextrading api's https://api.iextrading.com/1.0/stock/<symbol>/book, then adds stock's data - 
     *  symbol and company's name - to the DOM and to the stock's data list, sends socket event and 
     *  calls redraw the chart
     */
    function addStock(e){
        e.preventDefault();
        setProgress(true);
        let symbol = $('.fcc-sc-search-bar input').val().toUpperCase();
        if(symbol.trim() === ''){
            $('.fcc-sc-search-bar input').val('')
            setProgress(false);
            return;
        }
        
        if(getCard(symbol) != null) {
            $('.fcc-sc-search-bar input').val('')
            setProgress(false);
            return;
        }
        
        const url =
            "https://api.iextrading.com/1.0/stock/" + symbol + "/book";
        $.getJSON(url)
          .done(function(data){
            
            let symbol = '', companyName = '';
            if(data.quote && data.quote.symbol){
                symbol = data.quote.symbol;
                if(data.quote.companyName) companyName = data.quote.companyName;
                $.post('/data', {operation: 'ADD', symbol, companyName}, function(docs){
                    addCard({symbol, companyName});
                    let color = getCard(symbol).color;
                    socket.emit('changesWereMade');
                    let element = $('.fcc-sc-card:last-child');
                    if(element.length){
                        element.after(Card({symbol, companyName, color}));
                    } else {
                        $('#controls').append(Card({symbol, companyName, color}));
                    }
                     
                    $('.fcc-sc-search-bar input').val('')
                    createChart();
                }).fail(function() {
                    showMessage(REQUEST_ERROR_MESSAGE);
                    setProgress(false);
                });
               
            }

          })
          .fail(function(){
            showMessage(SYMBOL_ERROR_MESSAGE);
            setProgress(false);
          })
    }

    function setProgress(isWaiting){
        if(isWaiting) $('#progress').addClass('mdl-progress__indeterminate');
        else $('#progress').removeClass('mdl-progress__indeterminate');
    }
    

    /**
     *  Gets json from iextrading's api -  
     *  https://api.iextrading.com/1.0/stock/market/batch?symbols=<comma separated stock symbols>&types=quote,chart&range=5y&filter=symbol,companyName,date,minute,closewith five years data 
     *  that is five years historically adjusted market-wide data containing stock symbol, company name, date, time and close price.
     *  Then the function builds from this data the object seriesOptions for creating Highcharts JS's chart and passes it to function 
     *  that draws the chart.
     *  The seriesOptions is an array of objects which contain properties: name - a stock symbol, data - array of arrays that contain a pair - 
     *  time in milliseconds and price, and hsl or rgb color code.
     *  
     */
    function createChart(){
        let cards = getCards();
        let stockNames = Object.keys(cards).join(',');
        let seriesOptions = [];
        if(!stockNames.length){
            drawChart('chart', seriesOptions) 
            setProgress(false);
        } else {
        const url =
            "https://api.iextrading.com/1.0/stock/market/batch?symbols=" + stockNames + "&types=quote,chart&range=5y&filter=symbol,companyName,date,minute,close";
        $.getJSON(url, function(data){
             let chartsData = {};
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
                         if(data.average){
                             price = data.average;
                         } else if(data.close){
                            price = data.close;
                         }
                         return [current.getTime(), price]
                     } else {
                         return [0,0];
                     }
                        
                 })
             }
             
            for(let name in chartsData){
                seriesOptions.push({
                    name: name,
                    data: chartsData[name],
                    color: cards[name].color
                })
            }
            drawChart('chart', seriesOptions) 
            setProgress(false);
        }).fail(function() {
            showMessage(REQUEST_ERROR_MESSAGE);
            setProgress(false);
        });
        }
    }

});