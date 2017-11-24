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


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
        console.log(fieldvalues);

        for(var i=0; i<fieldvalues.length ; i++) {
            var name = fieldvalues[i].Name;
            var address = fieldvalues[i].Address;
            var Phone = fieldvalues[i].Phone;
            var FrameType = fieldvalues[i].FrameType;
            var FrameColour = fieldvalues[i].FrameColour;
            var KeyboardType = fieldvalues[i].KeyboardType;
            var KeyboardColour = fieldvalues[i].KeyboardColour;
            var ScreenType = fieldvalues[i].ScreenColour;
            var ScreenColour = fieldvalues[i].ScreenColour;
            var Quantity = fieldvalues[i].Quantity;

            orders.push(new Order(num_orders, name, address, Phone, FrameType, FrameColour, KeyboardType, KeyboardColour, ScreenType, ScreenColour, Quantity ))
            num_orders++;
        }



});


app.listen(8000, function(){
    console.log('Order Server Running on Port 8000');
});


