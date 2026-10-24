require("dotenv").config();
const ngrok = require('ngrok');
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const _ = require("lodash");
const { log } = require("console");

const exNum = require("exactnumber");
const shortNum = require("number-shortener");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


// node fetch 

// const fetch = require("node-fetch")

// fetch("${process.env.COINCAP_BASE_URL}/assets/ethereum")
// .then(res => res.text())
// .then(text => console.log(text.data));



app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");

});



// homepage setup

app.get("/home", function(req, res){

    const Url = `${process.env.COINCAP_BASE_URL}/assets`;

    const options = {
    url: Url,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.COINCAP_API_KEY}`,
    }
};
    
    request(options, function(response, error, body){
        if (body === undefined) {
            res.redirect("/")
        };

        let cryptoData = JSON.parse(body);

        let bitcoin = cryptoData.data[0];
        let ethereum = cryptoData.data[1];




    res.render("home", {

        // for bitcoin 
        btcLogo : _.lowerCase(bitcoin.symbol),
        btcRank : bitcoin.rank,
        btcSymbol : bitcoin.symbol,
        btcSupply : bitcoin.supply,
        btcChange : bitcoin.changePercent24Hr,
        btcPrice : bitcoin.priceUsd,

        // for ethereum 
        ethLogo : _.lowerCase(ethereum.symbol),
        ethRank : ethereum.rank,
        ethSymbol : ethereum.symbol,
        ethSupply : ethereum.supply,
        ethChange : ethereum.changePercent24Hr,
        ethPrice : ethereum.priceUsd,

        // rank 

        rank1 : cryptoData.data[0],
        rank2 : cryptoData.data[1],
        rank3 : cryptoData.data[2],
        rank4 : cryptoData.data[3],
        rank5 : cryptoData.data[4],
    })

    
});
});


app.post("/home", function(req, res){
    const searchValue = req.body.search;

    res.redirect("/searchresults/" + searchValue)

});



// parameters for search-results page show more button to work //


let param2 = "";

app.post("/searchresults/" + param2 ,function(req, res){

    
    let input = param2;

    let searchInput = _.replace(input.toLowerCase(), " ", "-")

    // if (_.startWith(searchInput, " ")) {
    //     // console.log("yes");
    // }

    let options = {
        url: `${process.env.COINCAP_BASE_URL}/assets`,
        method: "GET",
        qs: {
            search: searchInput,
        },
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.COINCAP_API_KEY}`,
        }
    };

    request(options, function(response, error, body){
        let searchResult = JSON.parse(body);
        let dataItems = searchResult.data;



    if (searchResult.error === undefined) {
            res.render("searchresults", {
                search : searchInput,
                items : dataItems,
                no : dataItems.length,
            });

    } else {
        res.render("errorpage", {})
    };


    });

});



app.get("/searchresults/:searchParam", function(req, res){

    let input = req.params.searchParam;

    param2 = input;

    // let searchInput = _.kebabCase(input.toLowerCase());
    let searchInput = _.replace(input.toLowerCase(), " ", "-")

    if (_.endsWith(searchInput, " ")) {
        console.log("yes");
    }

    let options = {
        url: `${process.env.COINCAP_BASE_URL}/assets`,
        method: "GET",
        qs: {
            search: searchInput,
        },
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.COINCAP_API_KEY}`,
        }
    }

    request(options, function(response, error, body){
        let searchResult = JSON.parse(body);

        console.log(body);
        
        let dataItems = searchResult.data;

        number = dataItems.length;

        // console.log(dataItems);

    // if (searchResult.error === undefined) {

        if (dataItems.length > 5) {
            res.render("searchresults", {
                search : searchInput,
                items : dataItems,
                input : input,
                no : 5,
            })
        } else {
            res.render("searchresults", {
                search : searchInput,
                items : dataItems,
                input : input,
                no : dataItems.length,
            });
        }

        // res.render("searchresults", {
        //     search : searchInput,
        //     items : dataItems,
        //     no : 5,
        // })

    // } else {
    //     res.render("errorpage", {})
    // };


    });
});











// datapage for cryptpo or search

app.get("/datapage/:searchParam", function(req, res){

    let searchUrl = req.params.searchParam;

    const url = `${process.env.COINCAP_BASE_URL}/assets/${_.replace(searchUrl, " ", "-")}`;

        const options = {
            url: Url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.COINCAP_API_KEY}`,
            }
        };

    request(options, function(response, error, body){

        let searchResult = JSON.parse(body);
        let searchData = searchResult.data;


if (searchResult.error === undefined) {
    res.render("datapage", {
        cryptoWebpage : searchData.explorer,
        cryptoLogo : _.lowerCase(searchData.symbol),
        cryptoName : searchData.name,
        cryptoSym : searchData.symbol,
        cryptoData : searchData,
    });
} else {
    res.render("errorpage", {})
};
        
    })
});











// conversion tab to change from currencies


let baseSymbol = "";
let baseName = "";
let baseValue = "";
let newSymbol = "";
let newValue = "";

// let quote = ""

app.get("/conversion", function(req, res){

    // request("https://type.fit/api/quotes", function(response, error, body){
    //     const quotes = JSON.parse(body);

    //     let randomNumber = Math.floor(Math.random()* 1642) + 1;
            
    //     quote = quotes[randomNumber];

    // })

    let url = "https://openexchangerates.org/api/currencies.json";

    request(url, function(response, error, body){

        // if (body === undefined) {
        //     res.render("errorpage", {})
        // };

        let list = Object.keys(JSON.parse(body));

        
        const options = {
            url: `${process.env.COINCAP_BASE_URL}/assets`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.COINCAP_API_KEY}`,
            }
        };

        request(options, function(response, error, body){

        // to get array of all crypto symbols
        let allCrypto = (JSON.parse(body)).data;
        // console.log(allCrypto);



            function financial(x, num) { 
            return (Number.parseFloat(x).toFixed(num)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

            const today = new Date()
            const options = {
                weekday: "long", 
                day: "numeric",
                month: "long",
                year: "numeric"
            };

            const date = today.toLocaleDateString("en-US", options);

            res.render("conversion", {

                // randomQuote : quote,
                crypto : allCrypto,
                todaysDate : date,
                option : list,
                symOne : baseSymbol,
                nameOne : baseName,
                valueOne : baseValue,
                symTwo : newSymbol,
                valueTwo : financial(newValue, 2),
                
            });

            baseSymbol = "";
            baseName = "";
            baseValue = "";
            newSymbol = "";
            newValue = "";

        });

    });
    
});

app.post("/conversion", (req, res)=>{

    try {
    let crypto =  _.replace((req.body.crypto).toLowerCase(), " ", "-");
    let fiat = req.body.fiat;
    let amount = req.body.amount;

    let options = {
        url: `${process.env.COINCAP_BASE_URL}/assets`,
        method: "GET",
        qs: {
            search: crypto,
        },
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.COINCAP_API_KEY}`,
        }
    }

    request(options, function(response, error, body){

        let info = JSON.parse(body);
        let data = info.data[0];
        let usdPrice = data.priceUsd;

        let cryptoToUsd = amount*usdPrice;

        let newOptions = {
            url: `${process.env.EXCHANGE_RATE_BASE_URL}/${process.env.EXCHANGE_RATE_API_KEY}/pair/USD/${fiat}/${cryptoToUsd}`,
            method: "GET",
        }
    
        request(newOptions, function(response, error, body){
            const convResponse = JSON.parse(body);
            console.log({convResponse, response});
            
            let answer = convResponse.conversion_result;
            
            let oldCurrency = (JSON.parse(body)).old_currency;

            baseSymbol = data.symbol,
            baseName = data.name,
            baseValue = amount,
            newSymbol = fiat,
            newValue = answer,

            res.redirect("/conversion");

        });



    });
    } catch (error) {
        console.error(error);
    }

})


// table page for top 20 data

app.get("/table", function(req, res){


    options = {
        url: `${process.env.COINCAP_BASE_URL}/assets`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.COINCAP_API_KEY}`,
        }
    }

    request(options, function(response, error, body){
        let data = (JSON.parse(body)).data;

        res.render("table", {
            exNum : exNum,
            shortNum : shortNum,
            cryptoData : data,
        });

        
    });
});




app.listen(process.env.PORT, function(){
    console.log("App running on port: " + process.env.PORT)
});

// ngrok setup 

// async function startNgrok (){
//     const url = await ngrok.connect({
//         addr: process.env.PORT,
//         authtoken_from_env: true,
//     })

//     console.log(`ingress established @ ${url}`)
// }

// startNgrok()