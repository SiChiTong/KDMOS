/**node app.js
 * Created by Joe David on 07-04-2017.
 */
var express = require('express');
var app = express();
var path = require('path');
//

 // instantiation of socket io object which is listening on port 4000

var builder = require('xmlbuilder');
var validator = require('xsd-schema-validator');
var bodyParser = require('body-parser')





app.use("/css", express.static(__dirname + '/css'));
app.use("/script", express.static(__dirname + '/script'));
app.use("/img", express.static(__dirname + '/img'));





app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/form1.html'));
});

app.post('/submit', function(req, res) {


});

app.listen(5000, function(){
    console.log('Server Running on Port 5000');
});