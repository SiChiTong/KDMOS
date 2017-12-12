/**
 * Created by Joe David on 22-11-2017.
 */
//including the modules
var request = require('request');
var express = require('express');
var app = express();


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }))

var port = 6000;



var optionsSim = {
    method: 'POST', //
    body: {"destUrl": "http://127.0.0.1"}, // Javascript object
    json: true,
    headers: {
        'Content-Type': 'application/json'
    }
};


//this route is from localhost:3000
app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Orchestrator is operational');
});

//defining counter variable and getting into the condition till counter is less than set value


app.post('/invokeService',function (req,res) {
    console.log('Received invoke command from the Workstation Class: ', req.body);
    optionsSim.url = JSON.parse(req.body);
    console.log("DEBUG 2: ",optionsSim.url);
    request(optionsSim, function(err,res){
        if(err){
            console.log('Error from Orchestrator: Error Invoking service on the line');
            console.log(res);
        }
    });
    res.end();



});



//Running server on port 3000. here the local host is waiting to connect to client.
app.listen(6500, function()
{
    console.log('Orchestrator running on port 6500');

});

