/**
 * Created by Joe David on 19-04-2017.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');
var pallcounter_=0;
var num_orders = 1;
var orders= new Array();
var sparqlgen = require('./SPARQLGen');
var parseXml = require('xml2js').parseString;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var Order= function(orderNumber, customerName, customerAddress, customerPhone, frameType, frameColour, keyboardType, keyboardColour, screenType, screenColour,orderQuantity) {
    this.orderNumber = orderNumber;
    this.customerName = customerName;
    this.customerAddress = customerAddress;
    this.customerPhone = customerPhone;
    this.frameType = frameType;
    this.frameColour = frameColour;
    this.keyboardType = keyboardType;
    this.keyboardColour = keyboardColour;
    this.screenType = screenType;
    this.screenColour = screenColour;
    this.orderQuantity= orderQuantity;
};

var optionsKB = {
    method: 'post',
    body: " ",
    json: true, // Use,If you are sending JSON data
    url:"",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept':'application/sparql-results+json,*/*;q=0.9'
    }
};

//function to make query to the fuseki server
function fuseki(type,query){
    if (type == "query")
    {
        optionsKB.url = "http://127.0.0.1:3032/iii2017/query";
    }
    else if (type == "update")
    {
        optionsKB.url = "http://127.0.0.1:3032/iii2017/update";
    }


    optionsKB.body = query; //Assembly of the new query


    request(optionsKB, function (err, res, body) {
        if (err) {
            console.log('Error instantiating Object in the knowledge base', err);
            return;
        }
        //console.log(body);
        parseXml(body, function (err, result) {
            console.log(result.html.body[0].h1);
            if (type == "update") {
                if (result.html.body[0].h1 == 'Success') {
                    console.log('Successful updation');
                }
                else {
                    console.log("Error while performing updation");
                }
            }
            else if(type == "query"){

            }


        });




        // for(var i = 0; i<body.results.bindings.length; i++) {
        //     var next = body.results.bindings[i].url.value;
        //     //var setValue = next;
        //     //requestOut(next);
        //     console.log(next);
        // }
    });
}






app.get('/', function(req,res){

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('\nI am the Order Class taking care of the Orders.');
        for(var i=0; i<orders.length ; i ++) {
                console.log(orders[i]);
        }


});
app.get('/submit', function(req,res){
        res.writeHead(200);
        res.end();

});

    //THIS IS ONLY A ONE TIME PIECE OF CODE THAT OCCURS WHEN THE ORDER IS PLACED. IT ISN'T LINKED TO THE WORKING OF THE SYSTEM. THIS IS TO  IMPLEMENT THE PERSISTENCE LAYER IN PARALLEL
app.post('/updateOrder', function(req,res){
        res.writeHead(200);
        res.end();
        console.log('Updated Order');
        var fieldvalues =  req.body;
       // console.log(fieldvalues);

    console.log(fieldvalues.data[0].Name);

        for(var i=0; i<fieldvalues.data.length ; i++) {

            // CREATING THE ORDER IN THE KNOWLEDGE BASE
            var j =i+1;
            query = sparqlgen.createInstance("Order");
            console.log(query);
            fuseki("update", query);
            var query1=sparqlgen.createInstanceProperty("Order_"+j,"hasCustomerName",fieldvalues.data[i].Name);
            fuseki("update",query1);
            var query2=sparqlgen.createInstanceProperty("Order_"+j,"hasAddress",fieldvalues.data[i].Address);
            fuseki("update",query2);
            var query3=sparqlgen.createInstanceProperty("Order_"+j,"hasPhone",fieldvalues.data[i].Phone);
            fuseki("update",query3);
            var query4=sparqlgen.createInstanceProperty("Order_"+j,"hasFrameType",fieldvalues.data[i].FrameType);
            fuseki("update",query4);
            var query5=sparqlgen.createInstanceProperty("Order_"+j,"hasFrameColour",fieldvalues.data[i].FrameColour);
            fuseki("update",query5);
            var query6=sparqlgen.createInstanceProperty("Order_"+j,"hasKeyboardType",fieldvalues.data[i].KeyboardType);
            fuseki("update",query6);
            var query7=sparqlgen.createInstanceProperty("Order_"+j,"hasKeyboardColour",fieldvalues.data[i].KeyboardColour);
            fuseki("update",query7);
            var query8=sparqlgen.createInstanceProperty("Order_"+j,"hasScreenType",fieldvalues.data[i].ScreenType);
            fuseki("update",query8);
            var query9=sparqlgen.createInstanceProperty("Order_"+j,"hasScreenColour",fieldvalues.data[i].ScreenColour);
            fuseki("update",query9);
            var query10=sparqlgen.createInstanceProperty("Order_"+j,"hasOrderQuantity",fieldvalues.data[i].Quantity);
            fuseki("update",query10);



            var name = fieldvalues.data[i].Name;
            var address = fieldvalues.data[i].Address;
            var Phone = fieldvalues.data[i].Phone;
            var FrameType = fieldvalues.data[i].FrameType;
            var FrameColour = fieldvalues.data[i].FrameColour;
            var KeyboardType = fieldvalues.data[i].KeyboardType;
            var KeyboardColour = fieldvalues.data[i].KeyboardColour;
            var ScreenType = fieldvalues.data[i].ScreenColour;
            var ScreenColour = fieldvalues.data[i].ScreenColour;
            var Quantity = fieldvalues.data[i].Quantity;

            orders.push(new Order(num_orders, name, address, Phone, FrameType, FrameColour, KeyboardType, KeyboardColour, ScreenType, ScreenColour, Quantity ));
            num_orders++;
        }



});


app.listen(8000, function(){
    console.log('Order Server Running on Port 8000');
});


