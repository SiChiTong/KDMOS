var express = require('express');
//var app = express();

var request = require('request');
var bodyParser = require('body-parser');


//define variables
var setValue;
var query1 = "query=PREFIX iii:<http://www.manufacturing.com/cellphones.owl#> SELECT* WHERE{iii:conveyor_1 iii:transZone45 ?url}";

//define query for the Knowledge base
var optionsKB = {
    method: 'post',
    body: " ",
    //json: true, // Use,If you are sending JSON data
    url: "http://127.0.0.1:3032/iii2017/query",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept':'application/sparql-results+json,*/*;q=0.9'
    }
};

//define query for S1000
var optionsCntrl = {
    method: 'post',
    body: {destUrl:''}, // Javascript object payload
    json: true,
    url: '',
    headers: {
        'Content-Type': 'application/json'
    }
};




var workstation= function (wsnumber, capability)
{
    this.wsnumber = wsnumber;
    this.capability = capability;
    this.zone1=false;
    this.zone2=false;
    this.zone3=false;
    this.zone4=false;
    this.zone5=false;
    this.port  = 1234;
    this.url = "127.0.0.1";
    this.buffer = 'free';
    this.status = 'free';
};

workstation.prototype.runServer = function (port)
{   var app = express();
    this.port = port;
    var ref1 = this; // explanation?
    var hostname = this.url; // can write direct url

    app.get('/', function (req, res) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.write('\nI am workstation ' + ref1.wsnumber);
        res.write('\nMy capability is: ' + ref1.capability);
        res.end('\nWorkstation ' + ref1.wsnumber + ' is running.');
    });
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    //HANDLE NOTIFICATION FROM THE FASTORY SIMULATOR
    app.post('/notifs/', function (req, res) {
        console.log(req.body);
        switch (req.body.id) {
            case "Z1_Changed":
                console.log(req.body.results);
                callNext(query1);
                break;
            case "Z2_Changed":
                break;
            case "Z3_Changed":
                break;
            case "Z4_Changed":
                break;
            case "Z5_Changed":
                break;
        }
        });



    app.listen(port, hostname, function () {
        console.log(' WorkStation Server WS' + ref1.wsnumber +' is running at http://' + hostname + ':' + port);
    });
    if((ref1.wsnumber>0)&&(ref1.wsnumber<10)) {
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z1_Changed/notifs', {form: {destUrl: "http://localhost:600"+ref1.wsnumber+"/notifs/"}});
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z2_Changed/notifs', {form: {destUrl: "http://localhost:600"+ref1.wsnumber+"/notifs/"}});
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z3_Changed/notifs', {form: {destUrl: "http://localhost:600"+ref1.wsnumber+"/notifs/"}});
       // request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z5_Changed/notifs', {form: {destUrl: "http://localhost:600"+ref1.wsnumber+"/notifs/"}});
        if((ref1.wsnumber!=1)&&(ref1.wsnumber!=7))
        {
            request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z4_Changed/notifs', {form: {destUrl: "http://localhost:600"+ref1.wsnumber+"/notifs/"}});
            request.post('http://localhost:3000/RTU/SimROB'+ref1.wsnumber+'/events/DrawEndExecution/notifs', {form: {destUrl: "http://localhost:600"+ref1.wsnumber+"/notifs/"}});
        }

    }
    if((ref1.wsnumber>9)&&(ref1.wsnumber<13)) {
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z1_Changed/notifs', {form: {destUrl: "http://localhost:60"+ref1.wsnumber+"/notifs/"}});
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z2_Changed/notifs', {form: {destUrl: "http://localhost:60"+ref1.wsnumber+"/notifs/"}});
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z3_Changed/notifs', {form: {destUrl: "http://localhost:60"+ref1.wsnumber+"/notifs/"}});
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z4_Changed/notifs', {form: {destUrl: "http://localhost:60"+ref1.wsnumber+"/notifs/"}});
      //  request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z5_Changed/notifs', {form: {destUrl: "http://localhost:60"+ref1.wsnumber+"/notifs/"}});
        request.post('http://localhost:3000/RTU/SimROB'+ref1.wsnumber+'/events/DrawEndExecution/notifs', {form: {destUrl: "http://localhost:60"+ref1.wsnumber+"/notifs/"}});
    }
};

const ws1 = new workstation(1,'paper');
const ws2 = new workstation(2,'red');
const ws3 = new workstation(3,'blue');
const ws4 = new workstation(4,'green');
const ws5 = new workstation(5,'red');
const ws6 = new workstation(6, 'blue');
const ws7 = new workstation(7,'loadpallet');
const ws8 = new workstation(8,'green');
const ws9 = new workstation(9, 'red');
const ws10 = new workstation(10, 'blue');
const ws11 = new workstation(11,  'green');
const ws12 = new workstation(12,  'red');

ws1.runServer(6001);
ws2.runServer(6002);
ws3.runServer(6003);
ws4.runServer(6004);
ws5.runServer(6005);
ws6.runServer(6006);
ws7.runServer(6007);
ws8.runServer(6008);
ws9.runServer(6009);
ws10.runServer(6010);
ws11.runServer(6011);
ws12.runServer(6012);
