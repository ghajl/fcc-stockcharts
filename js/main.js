import getRandomColor from '../util/RandomColor';
import {initChart, drawChart} from './chart';
import Card from '../components/Card';
import {SYMBOL_ERROR_MESSAGE} from '../util/Messages';

$(function () {
    setProgress(true);
    initChart();

    // Create the chart
    createChart();
    console.log(window.location)
    var socket = io();

    socket.on('changesWereMade', function () {
        setProgress(true);
        $.get('/data', function(docs){
            let currentDbStocks = docs.data.reduce((acc, company) => {acc[company.symbol] = company.companyName; return acc }, {})
            let currentLocalStocks = Object.keys(getCardsData());
            let currentDbStocksNames = Object.keys(currentDbStocks);
            let cardsToAdd = currentDbStocksNames.filter(stock => currentLocalStocks.indexOf(stock) == -1);
            let cardsToRemove = currentLocalStocks.filter(stock => currentDbStocksNames.indexOf(stock) == -1);
            if(cardsToRemove.length){
                cardsToRemove.forEach(name => {
                    $(`#${name}`).remove();
                })
            }
            if(cardsToAdd.length){
                cardsToAdd.forEach(symbol => {
                    let element = $('.fcc-sc-card:last-child');
                    if(element.length){
                        element.after(Card({symbol: symbol, name: currentDbStocks[symbol]}));
                    } else {
                        $('#controls').append(Card({symbol: symbol, name: currentDbStocks[symbol]}));
                    }
                })
                
            }
            setTimeout(createChart, 1000);
        })
    });

    $('#controls').on("click", ".fcc-sc-close", removeCard );


    $('.fcc-sc-search-bar form button').on("click", addStock);

    $('.fcc-sc-search-bar form').on("submit", addStock);


    function showMessage(message){
        $('.fcc-sc-search-bar input').val('');
        $('#messageDialog').modal();
    }

    $('#messageDialog').on('show.bs.modal', function (event) {
        var modal = $(this)
        modal.find('#text').text(SYMBOL_ERROR_MESSAGE)
    })

    function getCardsData(){
        return $('#controls .fcc-sc-card').map(function(){
            
            return { name: $(this).attr('id'),
                    color: $(this).find('.fcc-sc-symbol')[0].style.color
                }
        }).get().reduce((acc, val) => {
                            acc[val.name] = val.color;
                            return acc;
                        },{});
    }

    function removeCard() {
        setProgress(true);
        let element = $(this)
        let symbol = element.parent().attr('id');
        $.post('/data', {operation: 'REMOVE', symbol: symbol}, function(docs){
                    socket.emit('changesWereMade');
                    element.parent().fadeOut('fast', "linear", function(){
                        element.parent().remove();
                        createChart();
                    }) 
                    
                                       
                })

    }
    
    function addStock(e){
        e.preventDefault();
        setProgress(true);
        let symbol = $('.fcc-sc-search-bar input').val().toUpperCase();
        if(symbol.trim() === ''){
            $('.fcc-sc-search-bar input').val('')
            setProgress(false);
            return;
        }
        let cards = getCardsData();
        if(cards[symbol]) {
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
                $.post('/data', {operation: 'ADD', symbol: symbol, companyName: companyName}, function(docs){
                    socket.emit('changesWereMade');
                    let element = $('.fcc-sc-card:last-child');
                    if(element.length){
                        element.after(Card({symbol: symbol, name: companyName}));
                    } else {
                        $('#controls').append(Card({symbol: symbol, name: companyName}));
                    }
                     
                    $('.fcc-sc-search-bar input').val('')
                    createChart();
                })
               
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
    
    function createChart(){
        let cards = getCardsData();
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
                    color: cards[name]
                })
            }
            drawChart('chart', seriesOptions) 
            setProgress(false);
        })
        }
    }

});