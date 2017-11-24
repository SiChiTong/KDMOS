/**
 * Created by Joe David on 21-11-2017.
 */
const http = require('http');
const request = require('request');
const gatewayHost = '127.0.0.1'; //The local host IP.
const gatewayPort = 6000;
var formidable = require('formidable');
var sparqlgen = require('./SPARQLGen');

//Forming the parameters for the request as a JSON
//This structure will be used and updated to form valid call - url and body will be replaced.



const orchestratorServer = http.createServer(function(req, res) {
    var method = req.method;
    console.log("Method: " + method);


    if(method == 'GET'){
        //Handle GET method.
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Orchestrator Server is operational.');
    }

    else if(method == 'POST'){
        //Handle POST method.
        var body = [];
        var abc=[];
        // var fieldvalues = [];   //Array to hold the values of the fields in the form
        // query = sparqlgen.createInstance("Order");

        new formidable.IncomingForm().parse(req).on('field', function (name, value) { //in the event a field in the form is encountered
            fieldvalues.push(value);    //storing the field values in an array
        })
            .on('end', function () { //in the event of end of the form data
                console.log(fieldvalues);
                // var options = {
                //     method: 'post',
                //     body: fieldvalues,// Javascript object payload
                //     // json: true,
                //     url: "http://127.0.0.1:6000/",
                //     headers: {
                //         'Content-Type': 'application/json'
                //     }
                // };
                // request(options, function (err) {
                //     if(err){
                //         console.log("Error contacting Orchestrator");
                //     }
                //     else{
                //         console.log("Data sent to orchestrator");
                //     }
                // });

            });


        // req.on('data', function(chunk) {
        //     body.push(chunk);
        //     abc = JSON.parse(body.toString());
        //    // var result = callRESTService(abc, res);
        //
        // });
        console.log(abc);
        res.end();
    }
});


orchestratorServer.listen(gatewayPort, gatewayHost, () => {
    console.log(`Gateway server is running at http://${gatewayHost}:${gatewayPort}/`);
});



