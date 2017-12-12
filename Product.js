/**
 * Created by Joe David on 20-11-2017.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//product class

var product= function (frameType,  frameColour, screenType,screenColour,keyboardType,keyboardColour ) {
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
    this.hasPalletID = 0;
    this.isAtWS = 7;
    this.isAtZone = 3;
    this.currentneed  = 'paper';
};


exports.Product = product;