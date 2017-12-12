var app     =     require("express")();
var mysql   =     require("mysql");
var http    =     require('http').Server(app);
var io      =     require("socket.io")(http);
var request = require('request');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const PREFIX = "PREFIX iii:<http://www.manufacturing.com/ontology.owl#>";
var query = "query= " +PREFIX+"  SELECT * WHERE {?s iii:hasPalletID ?PalletID. ?s iii:belongstoOrder ?Order_no. ?s iii:hasFrameType ?Frame_type. ?s iii:hasFrameColour ?Frame_colour. ?s iii:hasKeyboardType ?Keyboard_type. ?s iii:hasKeyboardColour ?Keyboard_colour. ?s iii:hasScreenType ?Screen_type. ?s iii:hasScreenColour ?Screen_colour.  ?s iii:hasCurrentNeed ?Current_need. ?s iii:isAtWS ?Current_Ws.  ?s iii:isAtZone ?Current_Zone.} ";



var optionsKB = {
    method: 'post',
    body: query,
    json: true, // Use,If you are sending JSON data
    url: "http://127.0.0.1:3032/iii2017/query",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/sparql-results+json,*/*;q=0.9'
    }
};

app.get("/",function(req,res){
    res.sendFile(__dirname + '/index.html');
});
try {
     // instantiation of socket io object which is listening on port 4000
    io.on('connection',function(socket){ // socket connection

        socket.on('time',function(status){ // socket handling event
            request(optionsKB, function (err, res, body) {

                if (body.results.bindings.length > 0) {
                    socket.emit ("result is here", body.results.bindings); // emiting result to front end
                    console.log(body.results.bindings)
                }
                console.log(body.results.bindings)
            });
        });
        socket.on('disconnect', function () {
        setTimeout(function () {
        }, 10000);
    });
    });

} catch (err) {
    console.log(err);
}



http.listen(4000,function(){
    console.log("Listening on 4000");
});
