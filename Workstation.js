var express = require('express');
//var app = express();

var request = require('request');
var bodyParser = require('body-parser');
var functions = require('./Functions');
var sparqlgen = require('./SPARQLGen');
var parseXml = require('xml2js').parseString;


//define variables
var setValue;
var query1 = "query=PREFIX iii:<http://www.manufacturing.com/cellphones.owl#> SELECT* WHERE{iii:conveyor_1 iii:transZone45 ?url}";

//define query for the Knowledge base
var optionsUpdatepalletID = {
    method: 'post',
    body: " ",
    json: true, // Use,If you are sending JSON data
    url: "http://127.0.0.1:8000/updateProduct",
    headers: {
        'Content-Type': 'text/plain'
    }
};

//define query for S1000
var optionsOrchestrator = {
    method: 'post',
    body: '', // Javascript object payload
    json: true,
    url: 'http://127.0.0.1:6500/invokeService', //http://127.0.0.1:6500/invokeService
    headers: {
        'Content-Type': 'text/plain'
    }
};


function fuseki(type, query, tempgoal, callback) {

    var optionsKB = {
        method: 'post',
        body: query,
        json: true, // Use,If you are sending JSON data
        url: "",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/sparql-results+json,*/*;q=0.9'
        }
    };
    var query_ = query.split("WHERE")[0];
    if (type == "query") {
        var result;
        var str;
        var j=0;
        optionsKB.url = "http://127.0.0.1:3032/iii2017/query";
        request(optionsKB, function (err, res, body) {

            if (err) {
                console.log('Error querying the knowledge base', err);
                return;
            }
            //console.log(body);
            console.log('DEBUG 0:', query);
            console.log(body.results.bindings);
            if (query.includes("variable")) {
                // str = body.results.bindings[k].variable.value;
                var count = body.results.bindings.length;
                if (count >1){
                    if (query.includes("hasLinkDest")){
                        var links = [];
                        for (var i = 0; i < count; i++) {

                            links.push(body.results.bindings[i].variable.value);
                            console.log('DEBUG Y', temp);
                        }
                        var link_1 =  links[0];
                        var link_2 = links[1];
                        if(link_1.includes('TransZone'+tempgoal)){
                            result = link_1;
                            callback(result);
                        }
                        else if(link_2.includes('TransZone'+tempgoal)){
                            result = link_2;
                            callback(result);
                        }
                    }
                    else
                    {
                        var neighbours = [];
                        var neigh;
                        for (var i = 0; i < count; i++) {

                            // console.log('DEBUG Z', body.results);
                            // console.log('DEBUG A', body.results.bindings[count]);
                            var temp = body.results.bindings[i].variable.value;
                            console.log('DEBUG Y', temp);
                            if (temp.includes("#")) {
                                neighbours.push(temp.split("#")[1]);
                                console.log('DEBUG ZZ:', neighbours);
                            }
                        }
                        var neigh_1 = neighbours[0];
                        var neigh_2 = neighbours[1];
                        var query_1 = sparqlgen.getNeighbourQuery(neigh_1, "hasNeighbour");
                        var query_2 = sparqlgen.getNeighbourQuery(neigh_2, "hasNeighbour");
                        functions.fuseki("query", query_1, function (neighbour) {
                            if (neighbour == tempgoal) {
                                result = neigh_1;
                                callback(result);
                            }

                        })
                        functions.fuseki("query", query_2, function (neighbour) {
                            if (neighbour == tempgoal) {
                                result = neigh_2;
                                callback(result);
                            }
                        })
                        // for (var j=0;j<neighbours.length;j++){
                        // do {
                        //     console.log('DEBUG: ENTERING SECOND FOR LOOP:', j);
                        //     neigh = neighbours[j];
                        //     console.log('FROM second loop neighbourslist', neigh);
                        //     var query_ = sparqlgen.getNeighbourQuery(neigh, "hasNeighbour");
                        //
                        //     console.log('FROM second loop query_', query_);
                        //     console.log('FROM second loop tempgoal', tempgoal);
                        //     functions.fuseki("query", query_, function (neighbour) {
                        //         console.log('debug k: ', neighbour);
                        //         if (neighbour == tempgoal) {
                        //             console.log('entered tempgoal if statement with neigbour:' + neighbour + ' and tempgoal ' + tempgoal + 'J:' + j + 'neigh: ' + neigh);
                        //             result = neigh;
                        //             console.log("From functionW:", result);
                        //             callback(result);
                        //
                        //
                        //         }
                        //
                        //     });
                        //     j++
                        //     } while(j<neighbours.length);
                    }
                }

                else{
                    console.log(body.results.bindings);
                    str = body.results.bindings[0].variable.value;
                    if (str.includes("#")) {
                        result = str.split("#")[1];
                        console.log("From functionW:", result);
                        callback(result);
                    }
                    else {
                        result = str;
                        console.log("From functionW:", result);
                        callback(result);
                    }
                }
            }
            else if (query_.includes("currentneed")) {
                str = body.results.bindings[0].currentneed.value;
                if (str.includes("#")) {
                    result = str.split("#")[1];
                    console.log("From functionW:", result);
                    callback(result);
                }
                else {
                    result = str;
                    console.log("From functionW:", result);
                    callback(result);
                }
            }
            else if (query_.includes("frametype")) {
                str = body.results.bindings[0].frametype.value;
                console.log('STR: ',str);
                if (str.includes("#")) {
                    result = str.split("#")[1];
                    console.log("From functionW:", result);
                    callback(result);
                }
                else {
                    result = str;
                    console.log("From functionW:", result);
                    callback(result);
                }
            }
            else if (query_.includes("framecolour")) {
                str = body.results.bindings[0].framecolour.value;
                console.log('STR: ',str);
                if (str.includes("#")) {
                    result = str.split("#")[1];
                    console.log("From functionW:", result);
                    callback(result);
                }
                else {
                    result = str;
                    console.log("From functionW:", result);
                    callback(result);
                }
            }
            else if (query_.includes("screentype")) {
                str = body.results.bindings[0].screentype.value;
                console.log('STR: ',str);
                if (str.includes("#")) {
                    result = str.split("#")[1];
                    console.log("From functionW:", result);
                    callback(result);
                }
                else {
                    result = str;
                    console.log("From functionW:", result);
                    callback(result);
                }
            }
            else if (query_.includes("screencolour")) {
                str = body.results.bindings[0].screencolour.value;
                console.log('STR: ',str);
                if (str.includes("#")) {
                    result = str.split("#")[1];
                    console.log("From functionW:", result);
                    callback(result);
                }
                else {
                    result = str;
                    console.log("From functionW:", result);
                    callback(result);
                }
            }
            else if (query_.includes("keyboardtype")) {
                str = body.results.bindings[0].keyboardtype.value;
                console.log('STR: ',str);
                if (str.includes("#")) {
                    result = str.split("#")[1];
                    console.log("From functionW:", result);
                    callback(result);
                }
                else {
                    result = str;
                    console.log("From functionW:", result);
                    callback(result);
                }
            }
            else if (query_.includes("keyboardcolour")) {
                str = body.results.bindings[0].keyboardcolour.value;
                console.log('STR: ',str);
                if (str.includes("#")) {
                    result = str.split("#")[1];
                    console.log("From functionW:", result);
                    callback(result);
                }
                else {
                    result = str;
                    console.log("From functionW:", result);
                    callback(result);
                }
            }








        });


    }
    else if (type == "update") {
        optionsKB.url = "http://127.0.0.1:3032/iii2017/update";

    console.log("UPDATE: ",query);
        request(optionsKB, function (err, res, body) {
            if (err) {
                console.log('Error updating the knowledge base', err);
                return;
            }
            // console.log('DEBUG99: ',body);
            parseXml(body, function (err, result) {
                console.log('DEBUG100',result);
                console.log(result.html.body[0].h1);

                if (result.html.body[0].h1 == 'Success') {
                    console.log('Successful updation');
                    callback();
                }
                else {
                    console.log("Error while performing updation");
                    callback();
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


}


var workstation = function (wsnumber, equipment, zone1neighbor, zone2neighbor, zone3neighbor, zone4neighbor, robotUrl, conveyorUrl) {
    this.wsnumber = wsnumber;
    this.equip_with = equipment;
    this.zone1status = 'free';
    this.zone2status = 'free';
    this.zone3status = 'free';
    this.zone4status = 'free';
    this.zone5status = 'free';
    this.zone1ID = -1;
    this.zone2ID = -1;
    this.zone3ID = -1;
    this.zone4ID = -1;
    this.zone5ID = -1;
    this.port = 1234;
    this.robotUrl = robotUrl;
    this.conveyorUrl = conveyorUrl;
    this.url = '127.0.0.1';
    this.status = 'free';
};

workstation.prototype.runServer = function (port) {
    var app = express();
    this.port = port;
    var ref1 = this; // explanation?
    var hostname = this.url; // can write direct url

    app.get('/', function (req, res) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.write('\nI am workstation ' + ref1.wsnumber + 'from the CLASS Definition');
        res.write('\nMy zone1 has neighbor: ' + ref1.zone1neighbour);
        res.write('\nMy zone2 has neighbor: ' + ref1.zone2neighbour);
        res.write('\nMy zone3 has neighbor: ' + ref1.zone3neighbour);
        res.write('\nMy zone4 has neighbor:: ' + ref1.zone4neighbour);
        res.end('\nWorkstation ' + ref1.wsnumber + ' CLASS Server is running.');
    });
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    //EXECUTE ROUTE FOR EVERY WORKSTATION
    app.post('/execute/', function (req, res) {


        if (ref1.wsnumber == 7) {
            optionsOrchestrator.body = "http://" + ref1.robotUrl + "/RTU/SimROB" + ref1.wsnumber + "/services/LoadPallet";
        }
        console.log(optionsOrchestrator.body);
        request(optionsOrchestrator, function (err) {
            if (!err) {
                console.log('Load Pallet Command Issued by ' + ref1.wsnumber);
            }

            else {
                console.log('Error issuing Load Pallet Command');
            }
        });

    });

    //HANDLE NOTIFICATION FROM THE FASTORY SIMULATOR
    app.post('/notifs/', function (req, res) {
        console.log(req.body);


        var ws = req.body.senderID.split("V")[1];
        var zone = req.body.id.split("")[1];
        var temp = parseInt(ws);
        var next_ws;
        temp < 12? next_ws= temp+1: next_ws=1;
        console.log('DEBUG POINT 11111111');
        switch (req.body.id) {


            case "Z1_Changed":
                var PalletID = req.body.payload.PalletID;
                var temp_goal;
                console.log('DEBUG POINT 2222222');
                if (PalletID != -1) {
                    var update_ws = sparqlgen.updatePropertyGivenProperty("hasPalletID",PalletID,"isAtWS",'Workstation '+ws);
                    var update_zone = sparqlgen.updatePropertyGivenProperty("hasPalletID",PalletID,"isAtZone",'Zone '+zone);
                    console.log('Update Ws: ', update_ws);
                    console.log('Update Zone: ', update_zone);

                    fuseki("update",update_ws,'',function(){});
                    fuseki("update",update_zone,'',function(){});


                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var updateStatus = sparqlgen.updateProperty(subject,'hasStatus','occupied');
                    console.log('updateStatus: ', updateStatus);
                    fuseki("update",updateStatus,'',function(){});
                    console.log('DEBUG POINT 333333333');
                    console.log(PalletID);
                    var query = sparqlgen.getProductDetail(PalletID, "currentneed");
                    console.log(query);
                    fuseki("query", query, '', function (need) {
                        console.log('From function call, need: ', need);
                         //Gets Processed String for use by Knowledge Base
                        var subject3 = 'zone_3_'+ws;
                        console.log('Subject: ', subject);
                        var getNeighQuery = sparqlgen.getNeighbourQuery(subject, "hasNeighbour");    //gets query to find the neighbour of current location
                        console.log('getNeighQuery: ', getNeighQuery);
                        var checkstatusquery = sparqlgen.getInstanceProperty(subject3,"hasStatus");
                        fuseki("query",checkstatusquery,'',function(status){
                            console.log('DEBUG NEED CHECKING:  '+ need + " status: " + status);

                                if (status == 'occupied') {
                                    temp_goal = 'zone_1_' + next_ws;
                                }
                                else {
                                    if ((need == 'paper') || (need == 'unload')) {

                                        temp_goal = 'zone_1_' + next_ws;
                                    }
                                    else {
                                        temp_goal = 'zone_3_' + ws;

                                    }
                                }
                            fuseki("query", getNeighQuery, temp_goal, function (neighbour) {
                                var reachNeighLinkQuery = sparqlgen.reachNeighbourLinkQuery(neighbour);
                                console.log('reachNeighLinkQuery: ', reachNeighLinkQuery);
                                fuseki("query", reachNeighLinkQuery, '', function (link) {
                                    console.log('link: ', link);
                                    optionsOrchestrator.body = link;
                                    request(optionsOrchestrator, function (err, res, body) {
                                        if (err) {
                                            console.log('Error sending invoke  command to the orchestrator');
                                        }
                                    });
                                })
                            })

                        });

                    });

                }
                else {
                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var updateStatus = sparqlgen.updateProperty(subject,'hasStatus','free');
                    fuseki("update",updateStatus,'',function(){});
                }
                // callNext(query1);
                break;
            case "Z2_Changed":
                var PalletID = req.body.payload.PalletID;
                if(PalletID !=-1){
                    var update_ws = sparqlgen.updatePropertyGivenProperty("hasPalletID",PalletID,"isAtWS",'Workstation '+ws);
                    var update_zone = sparqlgen.updatePropertyGivenProperty("hasPalletID",PalletID,"isAtZone",'Zone '+zone);
                    fuseki("update",update_ws,'',function(){});
                    fuseki("update",update_zone,'',function(){});

                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var updateStatus = sparqlgen.updateProperty(subject,'hasStatus','occupied');
                    console.log('updateStatus: ', updateStatus);
                    fuseki("update",updateStatus,'',function(){});



                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var getNeighQuery = sparqlgen.getNeighbourQuery(subject, "hasNeighbour");
                    fuseki("query", getNeighQuery, 0, function (neighbour) {
                        var reachNeighLinkQuery = sparqlgen.reachNeighbourLinkQuery(neighbour);
                        fuseki("query", reachNeighLinkQuery, zone, function (link) {
                            optionsOrchestrator.body = link;
                            request(optionsOrchestrator, function (err, res, body) {
                                if (err) {
                                    console.log('Error sending invoke  command to the orchestrator');
                                }

                            });

                        })

                    });



                }

                else{
                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var updateStatus = sparqlgen.updateProperty(subject,'hasStatus','free');
                    console.log('updateStatus: ', updateStatus);
                    fuseki("update",updateStatus,'',function(){});
                }
                break;
            case "Z3_Changed":
                var PalletID = req.body.payload.PalletID;
                ref1.zone3ID = PalletID;
                if (PalletID != -1) {
                    var update_ws = sparqlgen.updatePropertyGivenProperty("hasPalletID",PalletID,"isAtWS",'Workstation '+ws);
                    var update_zone = sparqlgen.updatePropertyGivenProperty("hasPalletID",PalletID,"isAtZone",'Zone '+zone);
                    fuseki("update",update_ws,'',function(){});
                    fuseki("update",update_zone,'',function(){});

                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var updateStatus = sparqlgen.updateProperty(subject,'hasStatus','occupied');
                    console.log('updateStatus: ', updateStatus);
                    fuseki("update",updateStatus,'',function(){});

                    switch(req.body.senderID){
                        case "SimCNV1":
                            console.log('REACHED A', req.body.senderID );
                            console.log('printing A section request',req.body);
                            var query = sparqlgen.getProductDetail(PalletID, "currentneed");
                            fuseki("query", query, '', function (need) {
                                if(need == 'paper') {
                                    var exec_process_query = sparqlgen.getInstanceProperty('robot_' + ws, 'hasExecuteProcess');
                                    fuseki("query", exec_process_query, '', function (process) {
                                        var url_query = sparqlgen.getInstanceProperty(process, 'hasUrl');
                                        fuseki("query", url_query, '', function (url) {
                                            optionsOrchestrator.body = url;
                                            request(optionsOrchestrator, function (err, res, body) {
                                                if (err) {
                                                    console.log('Error sending invoke  command to the orchestrator');
                                                }
                                            });
                                        })
                                    })
                                }

                                else{
                                    var subject = functions.getSubject(req.body.id, req.body.senderID);  //Gets Processed String for use by Knowledge Base
                                    console.log('Subject: ', subject);
                                    var getNeighQuery = sparqlgen.getNeighbourQuery(subject, "hasNeighbour");    //gets query to find the neighbour of current location
                                    console.log('getNeighQuery: ', getNeighQuery);
                                    fuseki("query", getNeighQuery, 0, function (neighbour) {
                                        console.log('From function call: ', neighbour);
                                        var reachNeighLinkQuery = sparqlgen.reachNeighbourLinkQuery(neighbour);
                                        console.log('reachNeighLinkQuery: ', reachNeighLinkQuery);
                                        fuseki("query", reachNeighLinkQuery, 0, function (link) {
                                            console.log('link: ', link);
                                            optionsOrchestrator.body = link;
                                            request(optionsOrchestrator, function (err, res, body) {
                                                if (err) {
                                                    console.log('Error sending invoke  command to the orchestrator');
                                                }

                                            });
                                        });

                                    });
                                }
                            });

                            break;
                        case "SimCNV7":
                            // if(PalletID!=-1) {
                                var update_ws = sparqlgen.updatePropertyGivenProperty("hasPalletID",PalletID,"isAtWS",'Workstation '+ws);
                                var update_zone = sparqlgen.updatePropertyGivenProperty("hasPalletID",PalletID,"isAtZone",'Zone '+zone);
                                fuseki("update",update_ws,'',function(){});
                                fuseki("update",update_zone,'',function(){});

                                console.log("Dont do anything for now");
                                var subject = functions.getSubject(req.body.id, req.body.senderID);  //Gets Processed String for use by Knowledge Base
                                console.log('Subject: ', subject);
                                var getNeighQuery = sparqlgen.getNeighbourQuery(subject, "hasNeighbour");    //gets query to find the neighbour of current location
                                console.log('getNeighQuery: ', getNeighQuery);
                                fuseki("query", getNeighQuery, 0, function (neighbour) {
                                    console.log('From function call: ', neighbour);
                                    var reachNeighLinkQuery = sparqlgen.reachNeighbourLinkQuery(neighbour);
                                    console.log('reachNeighLinkQuery: ', reachNeighLinkQuery);
                                    fuseki("query", reachNeighLinkQuery, 0, function (link) {
                                        console.log('link: ', link);
                                        optionsOrchestrator.body = link;
                                        request(optionsOrchestrator, function (err, res, body) {
                                            if (err) {
                                                console.log('Error sending invoke  command to the orchestrator');
                                            }

                                        });
                                    });

                                });
                            // }
                            break;
                        default:
                            // if(PalletID!=-1) {
                                setTimeout(function () {
                                    var update_ws = sparqlgen.updatePropertyGivenProperty("hasPalletID",PalletID,"isAtWS",'Workstation '+ws);
                                    var update_zone = sparqlgen.updatePropertyGivenProperty("hasPalletID",PalletID,"isAtZone",'Zone '+zone);
                                    fuseki("update",update_ws,'',function(){});
                                    fuseki("update",update_zone,'',function(){});

                                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                                    var updateStatus = sparqlgen.updateProperty(subject,'hasStatus','occupied');
                                    console.log('updateStatus: ', updateStatus);

                                    console.log('REACHED C', req.body.senderID);
                                    console.log('XXXXXXXX', ws);
                                    var query = sparqlgen.getProductDetail(PalletID, "currentneed");
                                    fuseki("query", query, '', function (need) {
                                        var need_colour = need + 'colour';
                                        var need_type = need + 'type';
                                        var getneedcolour_query = sparqlgen.getProductDetail(PalletID, need_colour);
                                        var getneedtype_query = sparqlgen.getProductDetail(PalletID, need_type);
                                        console.log('Need Colour: ' + need_colour + 'Need Type:  ' + need_type);
                                        console.log('Need Type: Query  ' + getneedtype_query);
                                        fuseki("query", getneedcolour_query, '', function (colour) {
                                            need_colour = colour;
                                            fuseki("query", getneedtype_query, '', function (type) {
                                                need_type = type;
                                                var exec_process_query = sparqlgen.getInstanceProperty('robot_' + ws, 'hasExecuteProcess');
                                                fuseki("query", exec_process_query, '', function (process) {
                                                    console.log('Need Colour: ' + need_colour + 'Need Type:  ' + need_type);
                                                    var url_query = sparqlgen.getInstanceProperty(process, 'hasUrl');
                                                    fuseki("query", url_query, '', function (url) {
                                                        console.log('Ref1.equipwith', ref1.equip_with);
                                                        if (need_colour != ref1.equip_with) {
                                                            console.log('MISMATCH FOUND BETWEEN NEED COLOUR: ' + need_colour + ' AND EQUIPPED WITH: ' + ref1.equip_with);
                                                            console.log('EQUIPPING . . ');
                                                            var equipwith = 'ChangePen' + need_colour.toUpperCase();
                                                            console.log('Equipwith', equipwith);
                                                            optionsOrchestrator.body = url + equipwith;
                                                            request(optionsOrchestrator, function (err, res, body) {
                                                                if (err) {
                                                                    console.log('Error sending invoke  command to the orchestrator');
                                                                }
                                                            });

                                                        }
                                                        //GET DRAW URL NUMBER
                                                        var drawnum = functions.getdrawnumber(need_type)
                                                        console.log('Draw Num: ', drawnum);
                                                        optionsOrchestrator.body = url + drawnum;
                                                        console.log('Draw URL: ', optionsOrchestrator.body);

                                                        request(optionsOrchestrator, function (err, res, body) {
                                                            if (err) {
                                                                console.log('Error sending invoke  command to the orchestrator');
                                                            }
                                                        });
                                                    })
                                                })
                                            });

                                        });
                                    })

                                }, 1500);
                            break;
                            // }
                    }
                }
                else{
                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var updateStatus = sparqlgen.updateProperty(subject,'hasStatus','free');
                    console.log('updateStatus: ', updateStatus);
                    fuseki("update",updateStatus,'',function(){});
                }
                break;
            case "Z4_Changed":
                var PalletID = req.body.payload.PalletID;
                if (PalletID != -1){
                    var update_ws = sparqlgen.updatePropertyGivenProperty("hasPalletID",PalletID,"isAtWS",'Workstation '+ws);
                    var update_zone = sparqlgen.updatePropertyGivenProperty("hasPalletID",PalletID,"isAtZone",'Zone '+zone);
                    fuseki("update",update_ws,'',function(){});
                    fuseki("update",update_zone,'',function(){});

                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var updateStatus = sparqlgen.updateProperty(subject,'hasStatus','occupied');
                    console.log('updateStatus: ', updateStatus);
                    fuseki("update",updateStatus,'',function(){});


                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var getNeighQuery = sparqlgen.getNeighbourQuery(subject, "hasNeighbour");
                    fuseki("query", getNeighQuery, '', function (neighbour) {
                        var reachNeighLinkQuery = sparqlgen.reachNeighbourLinkQuery(neighbour);
                        fuseki("query", reachNeighLinkQuery, zone, function (link) {
                            optionsOrchestrator.body = link;
                            request(optionsOrchestrator, function (err, res, body) {
                                if (err) {
                                    console.log('Error sending invoke  command to the orchestrator');
                                }

                            });

                        })

                    });
                }

                else {

                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var updateStatus = sparqlgen.updateProperty(subject,'hasStatus','free');
                    console.log('updateStatus: ', updateStatus);
                    fuseki("update",updateStatus,'',function(){});

                }
                break;
            case "Z5_Changed":
                break;
            case "PalletLoaded"://update PalletID to the first product in OrderClass`

                optionsUpdatepalletID.body = req.body.payload.PalletID;
                request(optionsUpdatepalletID, function (err) {
                    if (err) {
                        console.log('Error requesting to update Pallet ID');
                    }
                    else {
                        console.log('Successfully requested to update Pallet');
                    }

                })
                break;
            case "PaperLoaded":

                var PalletID = ref1.zone3ID;
                var updatequery = sparqlgen.updatePropertyGivenProperty("hasPalletID",PalletID,"hasCurrentNeed","frame");
                console.log('debug 98',updatequery);
                fuseki("update",updatequery,'',function(){
                    console.log('98.5:'+req.body.id+' 98.7: ' + req.body.senderID)
                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var getNeighQuery = sparqlgen.getNeighbourQuery(subject, "hasNeighbour");
                    fuseki("query", getNeighQuery, 0, function (neighbour) {
                        console.log('From function call: ', neighbour);
                        var reachNeighLinkQuery = sparqlgen.reachNeighbourLinkQuery(neighbour);
                        console.log('reachNeighLinkQuery: ', reachNeighLinkQuery);
                        fuseki("query", reachNeighLinkQuery, 0, function (link) {
                            console.log('link: ', link);
                            optionsOrchestrator.body = link;
                            request(optionsOrchestrator, function (err, res, body) {
                                if (err) {
                                    console.log('Error sending invoke  command to the orchestrator');
                                }

                            });
                        });

                    });

                });

                break;
            case "DrawEndExecution":
                var PalletID = req.body.payload.PalletID;
                var Recipe = req.body.payload.Recipe;
                var color = req.body.payload.Color;
                var ws = req.body.senderID.split("B")[1];
                var zone = req.body.id.split("")[1];
                var nextneed;
                if((Recipe > 0)&&((Recipe < 4))){
                     nextneed = "screen";
                }
                else if ((Recipe > 3)&&((Recipe < 7))) {
                    nextneed = "keyboard";
                }
                else if ((Recipe > 6)&&((Recipe < 10))) {
                    nextneed = "unload";
                    var updatequery = sparqlgen.updatePropertyGivenProperty("hasPalletID", PalletID, "hasCurrentNeed", nextneed);
                    fuseki("update", updatequery, '', function () {
                        var subject = functions.getSubject('Z3_Changed', req.body.senderID);
                        var getNeighQuery = sparqlgen.getNeighbourQuery(subject, "hasNeighbour");
                        fuseki("query", getNeighQuery, '', function (neighbour) {
                            var reachNeighLinkQuery = sparqlgen.reachNeighbourLinkQuery(neighbour);
                            console.log('Zone: ',zone);
                            fuseki("query", reachNeighLinkQuery, '3', function (link) {
                                optionsOrchestrator.body = link;
                                request(optionsOrchestrator, function (err, res, body) {
                                    if (err) {
                                        console.log('Error sending invoke  command to the orchestrator');
                                    }
                                });
                            })
                        });
                    });
                }

                if(nextneed!="complete") {
                    var updatequery = sparqlgen.updatePropertyGivenProperty("hasPalletID", PalletID, "hasCurrentNeed", nextneed);
                    fuseki("update", updatequery, '', function () {
                        var query = sparqlgen.getProductDetail(PalletID, "currentneed");
                        fuseki("query", query, '', function (need) {
                            var need_colour = need + 'colour';
                            var need_type = need + 'type';
                            var getneedcolour_query = sparqlgen.getProductDetail(PalletID, need_colour);
                            var getneedtype_query = sparqlgen.getProductDetail(PalletID, need_type);
                            console.log('Need Colour: ' + need_colour + 'Need Type:  ' + need_type);
                            console.log('Need Type: Query  ' + getneedtype_query);
                            fuseki("query", getneedcolour_query, '', function (colour) {
                                need_colour = colour;
                                fuseki("query", getneedtype_query, '', function (type) {
                                    need_type = type;
                                    var exec_process_query = sparqlgen.getInstanceProperty('robot_' + ws, 'hasExecuteProcess');
                                    fuseki("query", exec_process_query, '', function (process) {
                                        console.log('Need Colour: ' + need_colour + 'Need Type:  ' + need_type);
                                        var url_query = sparqlgen.getInstanceProperty(process, 'hasUrl');
                                        fuseki("query", url_query, '', function (url) {
                                            console.log('Ref1.equipwith', ref1.equip_with);
                                            if (need_colour != ref1.equip_with) {
                                                console.log('MISMATCH FOUND BETWEEN NEED COLOUR: ' + need_colour + ' AND EQUIPPED WITH: ' + ref1.equip_with);
                                                console.log('EQUIPPING . . ');
                                                var equipwith = 'ChangePen' + need_colour.toUpperCase();
                                                console.log('Equipwith', equipwith);
                                                optionsOrchestrator.body = url + equipwith;
                                                request(optionsOrchestrator, function (err, res, body) {
                                                    if (err) {
                                                        console.log('Error sending invoke  command to the orchestrator');
                                                    }
                                                    else{
                                                        ref1.equip_with= need_colour;
                                                    }
                                                });

                                            }
                                            //GET DRAW URL NUMBER
                                            var drawnum = functions.getdrawnumber(need_type);
                                            console.log('Draw Num: ', drawnum);
                                            optionsOrchestrator.body = url + drawnum;
                                            console.log('Draw URL: ', optionsOrchestrator.body);
                                            request(optionsOrchestrator, function (err, res, body) {
                                                if (err) {
                                                    console.log('Error sending invoke  command to the orchestrator');
                                                }
                                            });
                                        })
                                    })
                                });
                            });

                        });
                    });
                }
                else{
                    console.log("FIRST ORDER COMPLETE. . .HURRRAAYY!!!");
                }

                break;
        }
    });


    app.listen(port, hostname, function () {
        console.log(' WorkStation CLASS Server WS' + ref1.wsnumber + ' is running at http://' + hostname + ':' + port);
    });
    if ((ref1.wsnumber > 0) && (ref1.wsnumber < 10)) {
        request.post('	http://localhost:3000/RTU/SimCNV' + ref1.wsnumber + '/events/Z1_Changed/notifs', {form: {destUrl: "http://localhost:600" + ref1.wsnumber + "/notifs/"}});
        request.post('	http://localhost:3000/RTU/SimCNV' + ref1.wsnumber + '/events/Z2_Changed/notifs', {form: {destUrl: "http://localhost:600" + ref1.wsnumber + "/notifs/"}});
        request.post('	http://localhost:3000/RTU/SimCNV' + ref1.wsnumber + '/events/Z3_Changed/notifs', {form: {destUrl: "http://localhost:600" + ref1.wsnumber + "/notifs/"}});
        // request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z5_Changed/notifs', {form: {destUrl: "http://localhost:600"+ref1.wsnumber+"/notifs/"}});
        if ((ref1.wsnumber != 1) && (ref1.wsnumber != 7)) {
            request.post('	http://localhost:3000/RTU/SimCNV' + ref1.wsnumber + '/events/Z4_Changed/notifs', {form: {destUrl: "http://localhost:600" + ref1.wsnumber + "/notifs/"}});
            request.post('http://localhost:3000/RTU/SimROB' + ref1.wsnumber + '/events/DrawEndExecution/notifs', {form: {destUrl: "http://localhost:600" + ref1.wsnumber + "/notifs/"}});
            ref1.loadpen();
        }

    }
    if ((ref1.wsnumber > 9) && (ref1.wsnumber < 13)) {
        request.post('	http://localhost:3000/RTU/SimCNV' + ref1.wsnumber + '/events/Z1_Changed/notifs', {form: {destUrl: "http://localhost:60" + ref1.wsnumber + "/notifs/"}});
        request.post('	http://localhost:3000/RTU/SimCNV' + ref1.wsnumber + '/events/Z2_Changed/notifs', {form: {destUrl: "http://localhost:60" + ref1.wsnumber + "/notifs/"}});
        request.post('	http://localhost:3000/RTU/SimCNV' + ref1.wsnumber + '/events/Z3_Changed/notifs', {form: {destUrl: "http://localhost:60" + ref1.wsnumber + "/notifs/"}});
        request.post('	http://localhost:3000/RTU/SimCNV' + ref1.wsnumber + '/events/Z4_Changed/notifs', {form: {destUrl: "http://localhost:60" + ref1.wsnumber + "/notifs/"}});
        //  request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z5_Changed/notifs', {form: {destUrl: "http://localhost:60"+ref1.wsnumber+"/notifs/"}});
        request.post('http://localhost:3000/RTU/SimROB' + ref1.wsnumber + '/events/DrawEndExecution/notifs', {form: {destUrl: "http://localhost:60" + ref1.wsnumber + "/notifs/"}});
    }
};

workstation.prototype.execute = function () {

};


function subscriptions() {

    request.post('http://localhost:3000/RTU/SimROB7/events/PalletLoaded/notifs', {form: {destUrl: "http://localhost:6007/notifs/"}}, function (err) {
        if (err) {
        } else {
            console.log('subscribed to pallet load');
        }
    });
    request.post('http://localhost:3000/RTU/SimROB1/events/PaperLoaded/notifs', {form: {destUrl: "http://localhost:6001/notifs/"}}, function (err) {
        if (err) {
        }
    });
    request.post('http://localhost:3000/RTU/SimROB7/events/PalletUnloaded/notifs', {form: {destUrl: "http://localhost:6007/notifs/"}}, function (err) {
        if (err) {
        }
    });
}
subscriptions();


workstation.prototype.loadpen = function () {
    ref=this;
    var options;
    var temp  = ref.equip_with;
    var equipment = temp.toUpperCase();

    var url= "http://127.0.0.1:3000/RTU/SimROB"+ref.wsnumber+"/services/ChangePen"+equipment;

    optionsOrchestrator.body = url;
    request(optionsOrchestrator, function (err) {

        if (err) {
            console.log('Error loading pen', err);
        }


    });
};

var ws1 = new workstation(1, 'paper', 'zone_2_1', 'zone_3_1', 'zone_5_1', 'NILL', '192.168.1.11', '192.168.1.12');
var ws2 = new workstation(2, 'red', '', '', '', '', '192.168.2.1', '192.168.2.2');
var ws3 = new workstation(3, 'blue', '', '', '', '', '192.168.3.1', '192.168.3.2');
var ws4 = new workstation(4, 'green', '', '', '', '', '192.168.4.1', '192.168.4.2');
var ws5 = new workstation(5, 'red', '', '', '', '', '192.168.5.1', '192.168.5.2');
var ws6 = new workstation(6, 'blue', '', '', '', '', '192.168.6.1', '192.168.6.2');
var ws7 = new workstation(7, 'loadpallet', 'zone_2_7', 'zone_3_7', 'zone_5_7', 'NILL', '127.0.0.1:3000', '127.0.0.1:3000');
var ws8 = new workstation(8, 'green', '', '', '', '', '192.168.8.1', '192.168.8.2');
var ws9 = new workstation(9, 'red', '', '', '', '', '192.168.9.1', '192.168.9.2');
var ws10 = new workstation(10, 'blue', '', '', '', '', '192.168.10.1', '192.168.10.2');
var ws11 = new workstation(11, 'green', '', '', '', '', '192.168.11.1', '192.168.11.2');
var ws12 = new workstation(12, 'red', '', '', '', '', '192.168.12.1', '192.168.12.2');


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