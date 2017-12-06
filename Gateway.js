/**
 * Created by Joe David on 21-11-2017.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');
var formidable = require('formidable');
var sparqlgen = require('./SPARQLGen');
var functions = require('./Functions');
var k=0;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Forming the parameters for the request as a JSON
//This structure will be used and updated to form valid call - url and body will be replaced.
var options = {
    method: 'post',
    body: {"":""}, // Javascript object payload
    json: true,
    url: "http://192.168.1.2/rest/services/resetOutput",
    headers: {
        'Content-Type': 'application/json'
    }
};


app.use(function (req, res, next) {
    console.log(req.method);
    var method = req.method;
    console.log("Method: " + method);

    if(method == 'OPTIONS'){
        //Handling "preflight"
        //First the client will ask about the options:
        //http://zacstewart.com/2012/04/14/http-options-method.html
        res.statusCode = 200;
        res.setHeader('Allow', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Origin', '*'); //Allowing cross domain/origin calls! https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
        // res.setHeader('Content-Type', 'application/json');
        res.end('OK');
    }
    else if(method == 'GET'){
        //Handle GET method.
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Gateway Server is operational.\nUse HTTP POST to invoke its operations. The payload should be as follows: \n{ url: <the url of the service>,\n' +
            'payload: <the payload message to POST to the service of the url>}');
    }

    else if(method == 'POST'){
        //Handle POST method.
         //Array to hold the values of the fields in the form
        //   query = sparqlgen.createInstance("Order");
        //  console.log(query);
     //   console.log('Req body: ',req.body)
        var fieldvalues =  req.body;
       console.log('Fieldvalues ',fieldvalues.data);

        for(var i=0; i<fieldvalues.data.length ; i++) {

            //CREATING THE ORDER IN THE KNOWLEDGE BASE
            for (var j = 0; j < fieldvalues.data[i].Quantity; j++) {
                ++k;


                query = sparqlgen.createInstance("Product");
                console.log(query);
                functions.fuseki("update", query);
                var query0 = sparqlgen.createInstanceProperty("Product_" + k, "belongstoOrder", fieldvalues.data[i].OrderNumber);
                functions.fuseki("update", query0);
                var query1 = sparqlgen.createInstanceProperty("Product_" + k, "hasCustomerName", fieldvalues.data[i].Name);
                functions.fuseki("update", query1);
                var query2 = sparqlgen.createInstanceProperty("Product_" + k, "hasAddress", fieldvalues.data[i].Address);
                functions.fuseki("update", query2);
                var query3 = sparqlgen.createInstanceProperty("Product_" + k, "hasPhone", fieldvalues.data[i].Phone);
                functions.fuseki("update", query3);
                var query4 = sparqlgen.createInstanceProperty("Product_" + k, "hasFrameType", fieldvalues.data[i].FrameType);
                functions.fuseki("update", query4);
                var query5 = sparqlgen.createInstanceProperty("Product_" + k, "hasFrameColour", fieldvalues.data[i].FrameColour);
                functions.fuseki("update", query5);
                var query6 = sparqlgen.createInstanceProperty("Product_" + k, "hasKeyboardType", fieldvalues.data[i].KeyboardType);
                functions.fuseki("update", query6);
                var query7 = sparqlgen.createInstanceProperty("Product_" + k, "hasKeyboardColour", fieldvalues.data[i].KeyboardColour);
                functions.fuseki("update", query7);
                var query8 = sparqlgen.createInstanceProperty("Product_" + k, "hasScreenType", fieldvalues.data[i].ScreenType);
                functions.fuseki("update", query8);
                var query9 = sparqlgen.createInstanceProperty("Product_" + k, "hasScreenColour", fieldvalues.data[i].ScreenColour);
                functions.fuseki("update", query9);
                var query10 = sparqlgen.createInstanceProperty("Product_" + k, "hasPalletID", "-1");
                functions.fuseki("update", query10);
                var query11 = sparqlgen.createInstanceProperty("Product_" + k, "isAtWS", "pending");
                functions.fuseki("update", query11);
                var query12 = sparqlgen.createInstanceProperty("Product_" + k, "isAtZone", "pending");
                functions.fuseki("update", query12);
                var query13 = sparqlgen.createInstanceProperty("Product_" + k, "hasCurrentNeed", "paper");
                functions.fuseki("update", query13);

            }
        }
            // new formidable.IncomingForm().parse(req).on('field', function (name, value) { //in the event a field in the form is encountered
        //     fieldvalues.push(value);    //storing the field values in an array
        // })
        //     .on('end', function () { //in the event of end of the form data
        //         console.log(fieldvalues);
        //
        //
        //     });

       // console.log(abc);

    }
});

// const gatewayServer = http.createServer(function(req, res) {

// });


app.listen(4500, () => {
    console.log(`Gateway server is running at http://127.0.0.1:4500/`);
});



