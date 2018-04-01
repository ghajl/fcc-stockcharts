import getRandomColor from '../util/RandomColor';
import {initChart, drawChart} from './chart';
import Card from '../components/Card';

$(function () {
    setProgress(true);
    initChart();
    // let cards = getCardsData();
    
    
    

    // Create the chart
    createChart();

    var socket = io.connect('http://localhost:3000');
    socket.on('changesWereMade', function () {
        // console.log('changes');
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
                    let element = $('.card:last-child');
                    if(element.length){
                        element.after(Card({symbol: symbol, name: currentDbStocks[symbol]}));
                    } else {
                        $('#controls').append(Card({symbol: symbol, name: currentDbStocks[symbol]}));
                    }
                })
                
            }
            
                         // console.log(cards);
                         // createChart();
            setTimeout(createChart, 1000);
        })
        // socket.emit('my other event', { my: 'data' });
    });

    $('#controls').on("click", ".close", removeCard );


    $('.search-bar form button').on("click", addStock);

    $('.search-bar form').on("submit", addStock);


    function getCardsData(){
        return $('#controls .card').map(function(){
            
            return { name: $(this).attr('id'),
                    color: $(this).find('.symbol')[0].style.color
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
                        // let cards = getCardsData();
                         // console.log(cards);
                        createChart();
                    }) 
                    
                                       
                })

    }
    
    function addStock(e){
        e.preventDefault();
        setProgress(true);
        let symbol = $('.search-bar input').val().toUpperCase();

        let cards = getCardsData();
        if(cards[symbol]) {
            $('.search-bar input').val('')
            setProgress(false);
            return;
        }
        const url =
               // "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=" + alphavantage_key;
            "https://api.iextrading.com/1.0/stock/" + symbol + "/book";
        $.getJSON(url)
          .done(function(data){
            
            let symbol = '', companyName = '';
            if(data.quote && data.quote.symbol){
                symbol = data.quote.symbol;
                if(data.quote.companyName) companyName = data.quote.companyName;
                $.post('/data', {operation: 'ADD', symbol: symbol, companyName: companyName}, function(docs){
                     // console.log(docs);
                    socket.emit('changesWereMade');
                    let element = $('.card:last-child');
                    if(element.length){
                        element.after(Card({symbol: symbol, name: companyName}));
                    } else {
                        $('#controls').append(Card({symbol: symbol, name: companyName}));
                    }
                     
                    // let cards = getCardsData();
                    $('.search-bar input').val('')
                    createChart();
                })
               
            }
            // let color = getRandomColor();
            // names[symbol.toUpperCase()] = color;

          })
          .fail(function(){
            console.log("err")
            setProgress(false);
          })
        // console.log(e);
    }

    
    // $.get("/data", function(data){
    //   console.log("Data: " + data);
    // });

    // Highcharts.setOptions({
    //     global: {
    //         useUTC: false
    //     }
    // });

    /**
     * Load new data depending on the selected min and max
     */
    


    
    // console.log(names)
    

    function setProgress(isWaiting){
        if(isWaiting) $('#progress').addClass('mdl-progress__indeterminate');
        else $('#progress').removeClass('mdl-progress__indeterminate');
    }
    
    function createChart(){
        let cards = getCardsData();
        let stockNames = Object.keys(cards).join(',');
        console.log(stockNames);
        let seriesOptions = [];
        if(!stockNames.length){
            drawChart('chart', seriesOptions) 
            setProgress(false);
        } else {
        const url =
               // "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=" + alphavantage_key;
            "https://api.iextrading.com/1.0/stock/market/batch?symbols=" + stockNames + "&types=quote,chart&range=5y&filter=symbol,companyName,date,minute,close";
        $.getJSON(url, function(data){
        //          res.setEncoding("utf8");
        //          let body = "";
        //          res.on("data", data => {
        //              body += data;
        //          });
        //          res.on("end", () => {
            // console.log(data);
            // let body = JSON.parse(data);
            
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
                         let current = new Date(year, month, day, hour, minute);//.getUTCMilliseconds();
                            
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
                // console.log(names);
                seriesOptions.push({
                    name: name,
                    data: chartsData[name],
                    color: cards[name]
                })
            }
            drawChart('chart', seriesOptions) 
            setProgress(false);
                            
        //              const appHTML = makePage(docs, chartsData);
                        
        //          });
        })
        }
    }

});