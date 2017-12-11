var request = require('request');
var express = require('express');
var app= express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


const PREFIX = "PREFIX iii:<http://www.manufacturing.com/ontology.owl#>";
var query = "query= " +PREFIX+"  SELECT * WHERE {?s iii:hasPalletID ?PalletID. ?s iii:belongstoOrder ?Order_no. ?s iii:hasFrameType ?Frame_type. ?s iii:hasFrameColour ?Frame_colour. ?s iii:hasKeyboardType ?Keyboard_type. ?s iii:hasKeyboardColour ?Keyboard_colour. ?s iii:hasScreenType ?Screen_type. ?s iii:hasScreenColour ?Screen_colour.  ?s iii:hasCurrentNeed ?Current_need. ?s iii:isAtWS ?Current_Ws.  ?s iii:isAtZone ?Current_Zone.} ";
console.log(query);
var optionsKB = {
    method: 'post',
    body: query,
    json: true, // Use,If you are sending JSON data
    url: "http://127.0.0.1:3032/iii2017/query",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/sparql-results+json,*/*;q=0.9'
    }
};
//querying the Knowledge Base
request(optionsKB, function (err, res, body) {

    console.log('BODY: ',body.head.vars);
    console.log('RESULTS: ',body.results.bindings[0]);
    console.log("Number of Products: ",body.results.bindings.length );//length of bidings gives the number of products or rows the html table should have
    console.log("Sample Row Value: ",body.results.bindings[0].PalletID.value); //sample value to access a Product Element
    console.log("Sample Row Value: ",body.results.bindings[1].Frame_type.value);
});