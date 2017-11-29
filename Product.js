/**
 * Created by Joe David on 20-04-2017.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');

var pallet = [];
var bin = '0b01'
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var product= function (frameType,  frameColour, screenType,screenColour,keyboardType,keyboardColour,palletID, palletnumber) {
    this.frame = false;
    this.keyboard = false;
    this.screen = false;
    this.paper = false;
    this.hasFrameType = frameType;
    this.hasFrameColour = frameColour;
    this.hasScreenType = screenType;
    this.hasScreenColour = screenColour;
    this.hasKeyboardType = keyboardType;
    this.hasKeyboardColour = keyboardColour;
    this.hasPalletID = palletID;
    this.orderNumber = 0;
    this.isAtWS = 7;
    this.isAtZone = 3;
    this.currentneed  = 'paper'
};

product.prototype.currentneed = function (ws,zone1,zone2) {

return this.currentneed;

};



app.get('/', function(req,res){

});


app.post('/notifs/', function(req,res) {

    //
    // switch (req.body.id) {
    //
    //     case "update":
    //         console.log('UPDATE AREA REACHED');
    //         if(req.body.payload.attribute == 'paper'){
    //             console.log('Received Request to update current need and paper status');
    //             ref.paper =req.body.payload.value;
    //             ref.currentneed = ref.frameColour;
    //             res.writeHead(200);
    //             res.end();
    //         }
    //         else if (req.body.payload.attribute == 'frame'){
    //             console.log('Received Request to update current need and frame status');
    //             ref.frame =req.body.payload.value;
    //             ref.currentneed = ref.screenColour;
    //             res.writeHead(200);
    //             res.end();
    //         }
    //         else if (req.body.payload.attribute == 'screen'){
    //             console.log('Received Request to update current need and screen status');
    //             ref.screen =req.body.payload.value;
    //             ref.currentneed = ref.keyboardColour;
    //             res.writeHead(200);
    //             res.end();
    //         }
    //         else if (req.body.payload.attribute == 'keyboard'){
    //             console.log('Received Request to update complete status');
    //             ref.keyboard =req.body.payload.value;
    //             ref.currentneed = 'complete';
    //             res.writeHead(200);
    //             res.end();
    //         }
    //
    //         else {
    //             console.log('Unknown update attribute')
    //         }
    //         break;
    //     case "currentneed":
    //
    //         for(var i = 0; i<pallet.length; i++){
    //
    //         }
    //         break;
    //     case "getstatus":
    //         res.writeHead(200, {'Content-Type': 'application/json'});
    //         res.write(JSON.stringify({ paperstatus: ref.paper, frame: ref.frame, screen: ref.screen, keyboard: ref.keyboard, frameType: ref.frameType,
    //             frameColour:ref.frameColour,screenType:ref.screenType,screenColour:ref.screenColour,keyboardType:ref.keyboardType,keyboardColour:ref.keyboardColour,
    //             palletID:ref.palletID,port:ref.port,currentneed:ref.currentneed}));
    //         res.end();
    //         break;
    //
    // }
});



app.post('/notifs', function(req,res){
    // var pallnum = pallcounter+1;
    // switch(req.body.id) {
    //
    //     case "createpallet":
    //
    //         console.log('New Pallet Created');
    //         //RESPONDING BACK TO THE ORDER AGENT
    //         res.writeHead(200, {'Content-Type': 'application/json'});
    //         res.write(JSON.stringify({ pallport: pallport, palletID: req.body.payload.palletID}));
    //         res.end();
    //         //CREATING NEW PALLET AGENT
    //         pallet.push(new product(req.body.payload.frameType, req.body.payload.frameColour, req.body.payload.screenType,
    //             req.body.payload.screenColour, req.body.payload.keyboardType, req.body.payload.keyboardColour, req.body.payload.palletID, pallport, pallnum));
    //         //PALLET REQUESTING THE WORKSTATION AGENT TO MOVE FROM ZONE 3 TO ZONE 5
    //         pallet[pallcounter].requestconv(7,3,5, function(){
    //             console.log('Requesting Conveyor. .');
    //         });
    //         pallet[pallcounter].runServer(pallport);
    //         setTimeout(function(){
    //
    //         },1000);
    //         break;
    // }
});


// app.listen(8000, function(){
//     console.log('Product CLASS Server Running on Port 8000');
//
//
// });

exports.Product = product;