/**
 * Created by Joe David on 19-04-2017.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');
var orders= new Array();
var sparqlgen = require('./SPARQLGen');
var parseXml = require('xml2js').parseString;
var product = require('./Product.js');
var functions = require('./Functions');
var product_num=1;
var product_num_ =1;
var product_status_ = false;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

var Order= function(orderNumber, customerName, customerAddress, customerPhone, orders) {
    this.orderNumber = orderNumber;
    this.customerName = customerName;
    this.customerAddress = customerAddress;
    this.customerPhone = customerPhone;
    this.products = [];
    this.orders = orders;

};

Order.prototype.addProduct = function(product) {
    this.products.push(product);
};
//function to update order with palletID
Order.prototype.getOrderInfo = function(palletID) {
    //TODO
    var result = '';
    for(var i = 0; i<this.products.length; i++){
        result = result + 'Product: ' + this.products[i].getDescription() + ' for ' + this.products[i].getPrice() + ' EUR.\n'
    }
    return result;
};

//Updates Order with palletID in KB and Class objects
function updateProduct(palletID) {


    for(var i = 0; i<orders.length; i++){
        for(var j = 0; j<orders[i].products.length; j++){
            if (orders[i].products[j].hasPalletID == 0){
                orders[i].products[j].hasPalletID = palletID;
                var query = sparqlgen.updateProperty("Product_" + product_num_, "hasPalletID",JSON.stringify(palletID));
                functions.fuseki("update", query);
                product_num_++;
                return;
            }

        }
    }

};

function listAllOrders() {
    console.log('DEBUG POINT2');
    console.log('Order Length', orders.length);

    for(var i = 0; i<orders.length; i++){
        console.log(orders[i].orderNumber);
        console.log('\n'+orders[i].customerName);
        for(var j = 0; j<orders[i].products.length; j++){
            console.log(orders[i].products[j].hasPalletID)
        }
        console.log('\n\n');
    }

}

// Order.prototype.listAllOrders = function() {
//     //TODO
//     var result = '';
//     for(var i = 0; i<this.orders.length; i++){
//         result = result + '\nOrder: ' + this.orders[i].orderNum;
//     }
//     console.log(result);
// };

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
        console.log(orders.length)
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
    console.log('FieldValues: ',fieldvalues.data);
    console.log('FieldValues length: ',fieldvalues.data.length);

        for(var i=0; i<fieldvalues.data.length ; i++) {


            var orderno = fieldvalues.data[i].OrderNumber;
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


            var ord =new Order(orderno, name, address, Phone, orders);
            for(var j =0; j<Quantity; j++) {
                ord.addProduct(new product.Product(FrameType, FrameColour, ScreenType, ScreenColour, KeyboardType, KeyboardColour));
            }
            orders.push(ord);

        }



});

app.post('/getProductDetails', function(req,res){



});

app.post('/updateProduct', function(req,res){
    console.log('Pallet ID: ',req.body)
    var palletID = req.body;
    updateProduct(palletID, function(){

    });
    console.log('DEbugg');

    res.end();
});



//POLLING MECHANISM TO CHECK FOR NEW ORDERS
setInterval(function () {     //set interval function
    var query = sparqlgen.checkOrder(product_num);

            functions.fuseki("query", query, function(product_status){
                console.log(query);
               product_status_= product_status
            });
    listAllOrders();
    }, 10000);

//POLLING MECHANISM TO CARRY OUT TASKS ONCE NEW ORDER HAS BEEN DETECTED
setInterval(function () {     //set interval function
    console.log('Global Status: ',product_status_);
    if(product_status_ == true){
        request.post('http://127.0.0.1:6007/execute');

        product_status_=false;
        product_num++;



    }

}, 3000);



app.listen(8000, function(){
    console.log('Order Server Running on Port 8000');
});


