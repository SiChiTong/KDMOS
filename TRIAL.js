/**
 * Created by Joe David on 10-04-2017.
 */

var mysql = require('mysql');


//DATABASE PARAMETERS
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306, //Port number to connect to the db
    user: 'root', //The user name assigned to work with the database
    password: 'oracle', //password for the database
    database: 'dasdfinal' //Name of the database
});

//CONNECTING TO DATABASE
connection.connect(function (err) {
    if (!err){
        console.log('Successfully connected to Database');
    }

});

connection.query("SELECT * FROM Pallets where Status = 'in_queue'", function(error,results,rows) {

    console.log(results.length);

});
// var mysql = require('mysql');
//
//
// //DATABASE PARAMETERS
// var connection = mysql.createConnection({
//     host: 'localhost',
//     port: 3306, //Port number to connect to the db
//     user: 'root', //The user name assigned to work with the database
//     password: 'oracle', //password for the database
//     database: 'dasdfinal' //Name of the database
// });
//
// //CONNECTING TO DATABASE
// connection.connect(function (err) {
//     if (!err){
//         console.log('Successfully connected to Database');
//     }
//
// });
// connection.query("UPDATE pallets SET PalletID = ? WHERE Status = 'processed'", 1492028421303, function (err) {
//     if(err){
//         console.log(err);
//     }
//
// });
//

//
// var options = {
//     method: 'POST', //http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenRED
//     body: {"destUrl": "http://127.0.0.1:3000"}, // Javascript object
//     json: true,
//     url: "	http://localhost:3000/RTU/SimROB2/services/ChangePenGREEN",
//     headers: {
//         'Content-Type': 'application/json'
// //     }}
// //
// var options1 = {
//     method: 'POST', //http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenRED
//  //   body: {"destUrl": "http://127.0.0.1:3000"}, // Javascript object
//     json: {"id":"Z1_Changed","payload":{"PalletID":"1492370618278"}},
//     url: "http://127.0.0.1:6008/notifs/8",
//     headers: {
//         'Content-Type': 'application/json'
//     }}
//
//     request(options1, function (err, res, body) {
//         if (err) {
//             console.log('Error loading pen', err);
//         }
//         else {
//             console.log(body);
//         }
//     });
// //
// var url="http://localhost:3000/RTU/SimROB2/services/Draw1"
// var options = {
//     method: 'POST',
//     body: {"destUrl": "http://127.0.0.1"},
//     json: true,
//     url: url,
//     headers: {
//         'Content-Type': 'application/json'
//     }
// };
// //Print the result of the HTTP POST request
// request(options, function (err, res, body) {
//     if (err) {
//         console.log('Error Drawing Frame');
//     }
//     else {
//         console.log(body);
//     }
// });
// function isfree(wsnumber,zone) {
//     request.get("http://localhost:3000/RTU/SimCNV2/data/P1", function (req, res, body) {
//         var obj = JSON.parse(res.body);
//         console.log(obj.v);
//         return obj.v;
//     });

// }
//
// isfree(8,2, function(result){
//     console.log(result)
// });


// request.get("	http://localhost:3000/RTU/SimCNV8/data/P1", function(req,res,body){
//     var present= false;
//     console.log(res.body);
//     var obj =JSON.parse(res.body)
//     console.log(obj.v);
    // if(res.body.v == 0){
    //     present = true;
    //     console.log(present)
    // }
    // else{
    //     present = false;
    //     console.log(present)
    // }


//
// request.post('	http://localhost:3000/RTU/SimROB3/services/Draw2', function(req,res,body){
//     console.log(res.body);
//
// });
// request.post('	http://localhost:3000/RTU/SimROB4/services/Draw3', function(req,res,body){
//     console.log(res.body);
//
// });
// request.post('	http://localhost:3000/RTU/SimROB5/services/Draw4', function(req,res,body){
//     console.log(res.body);
//
// });
// request.post('	http://localhost:3000/RTU/SimROB6/services/Draw5', function(req,res,body){
//     console.log(res.body);
//
// });
// request.post('	http://localhost:3000/RTU/SimROB8/services/Draw6', function(req,res,body){
//     console.log(res.body);
//
// });
// request.post('	http://localhost:3000/RTU/SimROB9/services/Draw7', function(req,res,body){
//     console.log(res.body);
//
// });
// request.post('	http://localhost:3000/RTU/SimROB10/services/Draw8', function(req,res,body){
//     console.log(res.body);
//
// });
// request.post('	http://localhost:3000/RTU/SimROB11/services/Draw9', function(req,res,body){
//     console.log(res.body);
//
// });
// request.post('	http://localhost:3000/RTU/SimROB12/services/Draw1', function(req,res,body){
//     console.log(res.body);
//
// // });
// for(var i =0; i< 30; i+=10) {
//     console.log(i)
// }