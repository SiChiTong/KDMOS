var express = require('express');
//var app = express();

var request = require('request');
var bodyParser = require('body-parser');
var functions = require('./Functions');
var sparqlgen = require('./SPARQLGen');
var parseXml = require('xml2js').parseString;


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

//FUNCTION TO UPDATE PALLET/ SENT TO ODRDER CLASS WHICH THEN UPDATES BOTH KB AND CLASS OBJECTS
function UpdatePalletID(PalletID) {
    var optionsUpdatepalletID = {
        method: 'post',
        body: " ",
        json: true, // Use,If you are sending JSON data
        url: "http://127.0.0.1:8000/updateProduct",
        headers: {
            'Content-Type': 'text/plain'
        }
    };
    optionsUpdatepalletID.body = PalletID;
    request(optionsUpdatepalletID, function (err) {
        if (!err) {
            console.log('Requested Order Class to Update Pallet ID ' + PalletID);
        }
    })
}

//FUNCTION TO INVOKE OPERATIONS ON THE ORCHESTRATOR
function Orchestrator(url) {

    optionsOrchestrator = {
        method: 'post',
        body: '', // Javascript object payload
        json: true,
        url: 'http://127.0.0.1:6500/invokeService', //http://127.0.0.1:6500/invokeService
        headers: {
            'Content-Type': 'text/plain'
        }
    };
    optionsOrchestrator.body = url;

    request(optionsOrchestrator, function (err) {
        if (!err) {
            console.log('Requested Orchestrator to Execute URl ' + url);
        }



    })

}

//FUNCTION TO QUERY THE FUSEKI SERVER
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
    console.log('FROM FUNCTION FUSEKI: Query Received: \n TYPE: ' + type + ' QUERY: ' + query);
    //If the type of the query is "query" and not ipdate
    if (type == "query") {
        var result;
        var str;
        optionsKB.url = "http://127.0.0.1:3032/iii2017/query";
        request(optionsKB, function (err, res, body) {

            if (err) {
                console.log('Error querying the knowledge base', err);
                return;
            }

            console.log('FROM FUNCTION FUSEKI: Query Result for Query: ' + query + ' IS: ' + body.results.bindings);
            if (query.includes("variable")) {
                var count = body.results.bindings.length;
                if (count > 1) {
                    if (query.includes("hasLinkDest")) {
                        var links = [];
                        for (var i = 0; i < count; i++) {

                            links.push(body.results.bindings[i].variable.value);
                        }
                        var link_1 = links[0];
                        var link_2 = links[1];
                        if (link_1.includes('TransZone' + tempgoal)) {
                            result = link_1;
                            callback(result);
                        }
                        else if (link_2.includes('TransZone' + tempgoal)) {
                            result = link_2;
                            callback(result);
                        }
                    }
                    else {
                        var neighbours = [];
                        var neigh;
                        for (var i = 0; i < count; i++) {
                            var temp = body.results.bindings[i].variable.value;
                            if (temp.includes("#")) {
                                neighbours.push(temp.split("#")[1]);
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

                        });
                        functions.fuseki("query", query_2, function (neighbour) {
                            if (neighbour == tempgoal) {
                                result = neigh_2;
                                callback(result);
                            }
                        });
                    }
                }

                else {
                    console.log(body.results.bindings);
                    str = body.results.bindings[0].variable.value;
                    if (str.includes("#")) {
                        result = str.split("#")[1];
                        console.log("FROM FUNCTION FUSEKI: ", result);
                        callback(result);
                    }
                    else {
                        result = str;
                        console.log("FROM FUNCTION FUSEKI: ", result);
                        callback(result);
                    }
                }
            }
            else if (query_.includes("currentneed")) {
                str = body.results.bindings[0].currentneed.value;
                if (str.includes("#")) {
                    result = str.split("#")[1];
                    console.log("FROM FUNCTION FUSEKI: Current Need:  ", result);
                    callback(result);
                }
                else {
                    result = str;
                    console.log("FROM FUNCTION FUSEKI: ", result);
                    callback(result);
                }
            }
            else if (query_.includes("frametype")) {
                str = body.results.bindings[0].frametype.value;
                console.log('STR: ', str);
                if (str.includes("#")) {
                    result = str.split("#")[1];
                    console.log("FROM FUNCTION FUSEKI: Frame Type:  ", result);
                    callback(result);
                }
                else {
                    result = str;
                    console.log("FROM FUNCTION FUSEKI: ", result);
                    callback(result);
                }
            }
            else if (query_.includes("framecolour")) {
                str = body.results.bindings[0].framecolour.value;
                console.log('STR: ', str);
                if (str.includes("#")) {
                    result = str.split("#")[1];
                    console.log("FROM FUNCTION FUSEKI: Frame Colour:  ", result);
                    callback(result);
                }
                else {
                    result = str;
                    console.log("FROM FUNCTION FUSEKI: ", result);
                    callback(result);
                }
            }
            else if (query_.includes("screentype")) {
                str = body.results.bindings[0].screentype.value;
                console.log('STR: ', str);
                if (str.includes("#")) {
                    result = str.split("#")[1];
                    console.log("FROM FUNCTION FUSEKI:Screen Type: ", result);
                    callback(result);
                }
                else {
                    result = str;
                    console.log("FROM FUNCTION FUSEKI: ", result);
                    callback(result);
                }
            }
            else if (query_.includes("screencolour")) {
                str = body.results.bindings[0].screencolour.value;
                console.log('STR: ', str);
                if (str.includes("#")) {
                    result = str.split("#")[1];
                    console.log("FROM FUNCTION FUSEKI: Screen Colour:  ", result);
                    callback(result);
                }
                else {
                    result = str;
                    console.log("FROM FUNCTION FUSEKI:  ", result);
                    callback(result);
                }
            }
            else if (query_.includes("keyboardtype")) {
                str = body.results.bindings[0].keyboardtype.value;
                console.log('STR: ', str);
                if (str.includes("#")) {
                    result = str.split("#")[1];
                    console.log("FROM FUNCTION FUSEKI: ", result);
                    callback(result);
                }
                else {
                    result = str;
                    console.log("FROM FUNCTION FUSEKI: Keyboard Type:  ", result);
                    callback(result);
                }
            }
            else if (query_.includes("keyboardcolour")) {
                str = body.results.bindings[0].keyboardcolour.value;
                console.log('STR: ', str);
                if (str.includes("#")) {
                    result = str.split("#")[1];
                    console.log("FROM FUNCTION FUSEKI: Keyboard Colour: ", result);
                    callback(result);
                }
                else {
                    result = str;
                    console.log("FROM FUNCTION FUSEKI: ", result);
                    callback(result);
                }
            }
        });
    }

    else if (type == "update") {
        optionsKB.url = "http://127.0.0.1:3032/iii2017/update";

        request(optionsKB, function (err, res, body) {
            if (err) {
                console.log('FROM FUNCTION FUSEKI: Error updating the knowledge base', err);
                return;
            }
            // console.log('DEBUG99: ',body);
            parseXml(body, function (err, result) {
                console.log(result.html.body[0].h1);

                if (result.html.body[0].h1 == 'Success') {
                    console.log('FROM FUNCTION FUSEKI: Successful updation');
                    callback();
                }
                else {
                    console.log("FROM FUNCTION FUSEKI: Error while performing updation");
                    callback();
                }
            });
        });
    }


}

//CLASS WORKSTATION
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
    this.bypassflag = false;

};

//METHOD RUNSERVER OF CLASS WORKSTATION
workstation.prototype.runServer = function (port) {
    var app = express();
    this.port = port;
    var ref1 = this; // explanation?
    var hostname = this.url; // can write direct url

    app.get('/', function (req, res) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.write('\nI am workstation ' + ref1.wsnumber + 'from the CLASS Definition');
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
        temp < 12 ? next_ws = temp + 1 : next_ws = 1;
        switch (req.body.id) {


            case "Z1_Changed":
                var PalletID = req.body.payload.PalletID;
                var temp_goal;
                if (PalletID != -1) {
                    var update_ws = sparqlgen.updatePropertyGivenProperty("hasPalletID", PalletID, "isAtWS", 'Workstation ' + ws);
                    var update_zone = sparqlgen.updatePropertyGivenProperty("hasPalletID", PalletID, "isAtZone", 'Zone ' + zone);
                    fuseki("update", update_ws, '', function () {
                    });
                    fuseki("update", update_zone, '', function () {
                    });
                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var updateStatus = sparqlgen.updateProperty(subject, 'hasStatus', 'occupied');
                    fuseki("update", updateStatus, '', function () {
                    });
                    var query = sparqlgen.getProductDetail(PalletID, "currentneed");
                    console.log(query);
                    fuseki("query", query, '', function (need) {
                        var subject3 = 'zone_3_' + ws;
                        var subject2 = 'zone_2_' + ws;
                        var getNeighQuery = sparqlgen.getNeighbourQuery(subject, "hasNeighbour");    //gets query to find the neighbour of current location
                        var checkstatus3query = sparqlgen.getInstanceProperty(subject3, "hasStatus");
                        var checkstatus2query = sparqlgen.getInstanceProperty(subject2, "hasStatus");
                        fuseki("query", checkstatus3query, '', function (status3) {
                            fuseki("query", checkstatus2query, '', function (status2) {
                                if ((status3 == 'occupied') || (status2 == 'occupied')) {
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
                                    var nextzonestatusquery = sparqlgen.getInstanceProperty(neighbour, "hasStatus")
                                    fuseki("query", nextzonestatusquery, '', function (nextstatus) {
                                        if (nextstatus == 'free') {
                                            var reachNeighLinkQuery = sparqlgen.reachNeighbourLinkQuery(neighbour);
                                            fuseki("query", reachNeighLinkQuery, '', function (link) {
                                                Orchestrator(link);
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    });
                }
                else {
                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var updateStatus = sparqlgen.updateProperty(subject, 'hasStatus', 'free');
                    fuseki("update", updateStatus, '', function () {
                    });
                }
                // callNext(query1);
                break;
            case "Z2_Changed":
                var PalletID = req.body.payload.PalletID;
                if (PalletID != -1) {
                    var update_ws = sparqlgen.updatePropertyGivenProperty("hasPalletID", PalletID, "isAtWS", 'Workstation ' + ws);
                    var update_zone = sparqlgen.updatePropertyGivenProperty("hasPalletID", PalletID, "isAtZone", 'Zone ' + zone);
                    fuseki("update", update_ws, '', function () {
                    });
                    fuseki("update", update_zone, '', function () {
                    });

                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var updateStatus = sparqlgen.updateProperty(subject, 'hasStatus', 'occupied');
                    fuseki("update", updateStatus, '', function () {
                    });


                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var getNeighQuery = sparqlgen.getNeighbourQuery(subject, "hasNeighbour");
                    fuseki("query", getNeighQuery, 0, function (neighbour) {
                        var nextzonestatusquery = sparqlgen.getInstanceProperty(neighbour, "hasStatus")
                        fuseki("query", nextzonestatusquery, '', function (nextstatus) {
                            if (nextstatus == 'free') {
                                var reachNeighLinkQuery = sparqlgen.reachNeighbourLinkQuery(neighbour);
                                fuseki("query", reachNeighLinkQuery, zone, function (link) {
                                    Orchestrator(link);
                                })
                            }

                        })
                    });
                }

                else {
                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var updateStatus = sparqlgen.updateProperty(subject, 'hasStatus', 'free');
                    fuseki("update", updateStatus, '', function () {
                    });
                }
                break;
            case "Z3_Changed":
                var PalletID = req.body.payload.PalletID;
                ref1.zone3ID = PalletID;
                if (PalletID != -1) {
                    var update_ws = sparqlgen.updatePropertyGivenProperty("hasPalletID", PalletID, "isAtWS", 'Workstation ' + ws);
                    var update_zone = sparqlgen.updatePropertyGivenProperty("hasPalletID", PalletID, "isAtZone", 'Zone ' + zone);
                    fuseki("update", update_ws, '', function () {
                    });
                    fuseki("update", update_zone, '', function () {
                    });

                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var updateStatus = sparqlgen.updateProperty(subject, 'hasStatus', 'occupied');
                    fuseki("update", updateStatus, '', function () {
                    });

                    switch (req.body.senderID) {
                        case "SimCNV1":
                            var query = sparqlgen.getProductDetail(PalletID, "currentneed");
                            fuseki("query", query, '', function (need) {
                                if (need == 'paper') {
                                    var exec_process_query = sparqlgen.getInstanceProperty('robot_' + ws, 'hasExecuteProcess');
                                    fuseki("query", exec_process_query, '', function (process) {
                                        var url_query = sparqlgen.getInstanceProperty(process, 'hasUrl');
                                        fuseki("query", url_query, '', function (url) {
                                            Orchestrator(url);
                                        })
                                    })
                                }

                                else {
                                    setInterval(function () {
                                        var subject = functions.getSubject(req.body.id, req.body.senderID);  //Gets Processed String for use by Knowledge Base
                                        var getNeighQuery = sparqlgen.getNeighbourQuery(subject, "hasNeighbour");    //gets query to find the neighbour of current location
                                        fuseki("query", getNeighQuery, 0, function (neighbour) {
                                            var nextzonestatusquery = sparqlgen.getInstanceProperty(neighbour, "hasStatus")
                                            fuseki("query", nextzonestatusquery, '', function (status) {
                                                if (status == 'free') {
                                                    var reachNeighLinkQuery = sparqlgen.reachNeighbourLinkQuery(neighbour);
                                                    fuseki("query", reachNeighLinkQuery, 0, function (link) {
                                                        Orchestrator(link);
                                                    });
                                                }
                                            });
                                        });
                                    }, 1000);
                                }
                            });

                            break;
                        case "SimCNV7":
                            // if(PalletID!=-1) {
                            setTimeout(function () {
                                var update_ws = sparqlgen.updatePropertyGivenProperty("hasPalletID", PalletID, "isAtWS", 'Workstation ' + ws);
                                var update_zone = sparqlgen.updatePropertyGivenProperty("hasPalletID", PalletID, "isAtZone", 'Zone ' + zone);
                                fuseki("update", update_ws, '', function () {
                                });
                                fuseki("update", update_zone, '', function () {
                                });
                                var subject = functions.getSubject(req.body.id, req.body.senderID);  //Gets Processed String for use by Knowledge Base
                                var query = sparqlgen.getProductDetail(PalletID, "currentneed");
                                fuseki("query", query, '', function (need) {
                                    if (need == 'unload') {
                                        var unloadquery = sparqlgen.getInstanceProperty(need, 'hasUrl')
                                        fuseki("query", unloadquery, '', function (link) {
                                            console.log("Pallet " + PalletID + " Unloaded");
                                            Orchestrator(link);
                                            setTimeout(function () {
                                                var updateStatus = sparqlgen.updateProperty(subject, 'hasStatus', 'free');
                                                fuseki("update", updateStatus, '', function () {
                                                    console.log('DEBUG: ' + updateStatus)
                                                })
                                            },700)

                                        })
                                    }
                                    else {
                                        var getNeighQuery = sparqlgen.getNeighbourQuery(subject, "hasNeighbour");    //gets query to find the neighbour of current location
                                        fuseki("query", getNeighQuery, 0, function (neighbour) {
                                            var nextzonestatusquery = sparqlgen.getInstanceProperty(neighbour, "hasStatus")
                                            fuseki("query", nextzonestatusquery, '', function (nextstatus) {
                                                if (nextstatus == 'free') {
                                                    var reachNeighLinkQuery = sparqlgen.reachNeighbourLinkQuery(neighbour);
                                                    fuseki("query", reachNeighLinkQuery, 0, function (link) {
                                                        Orchestrator(link);
                                                    });
                                                }
                                            });

                                        });
                                    }
                                });
                            }, 1500);
                            // }
                            break;
                        default:
                            // if(PalletID!=-1) {
                            setTimeout(function () {
                                var update_ws = sparqlgen.updatePropertyGivenProperty("hasPalletID", PalletID, "isAtWS", 'Workstation ' + ws);
                                var update_zone = sparqlgen.updatePropertyGivenProperty("hasPalletID", PalletID, "isAtZone", 'Zone ' + zone);
                                fuseki("update", update_ws, '', function () {
                                });
                                fuseki("update", update_zone, '', function () {
                                });

                                var subject = functions.getSubject(req.body.id, req.body.senderID);
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
                                                        Orchestrator(url + equipwith);
                                                        ref1.equip_with = need_colour;

                                                    }
                                                    //GET DRAW URL NUMBER
                                                    var drawnum = functions.getdrawnumber(need_type);
                                                    console.log('Draw Num: ', drawnum);
                                                    // optionsOrchestrator.body = url + drawnum;
                                                    // console.log('Draw URL: ', optionsOrchestrator.body);

                                                    Orchestrator(url + drawnum);
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
                else {
                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var updateStatus = sparqlgen.updateProperty(subject, 'hasStatus', 'free');
                    fuseki("update", updateStatus, '', function () {
                    });
                }
                break;
            case "Z4_Changed":
                var PalletID = req.body.payload.PalletID;
                if (PalletID != -1) {
                    var update_ws = sparqlgen.updatePropertyGivenProperty("hasPalletID", PalletID, "isAtWS", 'Workstation ' + ws);
                    var update_zone = sparqlgen.updatePropertyGivenProperty("hasPalletID", PalletID, "isAtZone", 'Zone ' + zone);
                    fuseki("update", update_ws, '', function () {
                    });
                    fuseki("update", update_zone, '', function () {
                    });

                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var updateStatus = sparqlgen.updateProperty(subject, 'hasStatus', 'occupied');
                    fuseki("update", updateStatus, '', function () {
                    });


                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var getNeighQuery = sparqlgen.getNeighbourQuery(subject, "hasNeighbour");
                    fuseki("query", getNeighQuery, '', function (neighbour) {
                        // console.log('ZONE 4 DEBUG: NEIGHBOUR: ', neighbour);
                        var nextzonestatusquery = sparqlgen.getInstanceProperty(neighbour, "hasStatus")
                        // console.log('ZONE 4 DEBUG: nextzonestatusquery: ', nextzonestatusquery);
                        fuseki("query", nextzonestatusquery, '', function (nextstatus) {
                            // console.log('ZONE 4 DEBUG: nextstatus: ', nextstatus);
                            // console.log('ZONE 4 DEBUG: REF.1BYPASS (SHOULD BE FALSE): ', ref1.bypassflag);
                            if ((nextstatus == 'free') && (ref1.bypassflag == false)) {
                                // console.log('ZONE 4 DEBUG: ENTERING MOVE CONDIDTION');
                                ref1.bypassflag = true;
                                var reachNeighLinkQuery = sparqlgen.reachNeighbourLinkQuery(neighbour);
                                // console.log('ZONE 4 DEBUG: ZONE (SHOULD BE 4): ', zone);
                                fuseki("query", reachNeighLinkQuery, zone, function (link) {
                                    Orchestrator(link);
                                })
                            }
                        });

                    });
                }

                else {

                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var updateStatus = sparqlgen.updateProperty(subject, 'hasStatus', 'free');
                    fuseki("update", updateStatus, '', function () {
                    });

                }
                break;
            case "Z5_Changed":
                var PalletID = req.body.payload.PalletID;
                if (PalletID != -1) {

                }
                else {
                    ref1.bypassflag = false;

                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    console.log('DEBUG 5: SUBJECT', subject);
                    var previousneighbourquery = sparqlgen.getPreviousNeighbour('zone_1_'+next_ws);
                    console.log('DEBUG 5: previousneighbourquery', previousneighbourquery);
                    var optionsKB = {
                        method: 'post',
                        body: previousneighbourquery,
                        json: true, // Use,If you are sending JSON data
                        url: "http://127.0.0.1:3032/iii2017/query",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'Accept': 'application/sparql-results+json,*/*;q=0.9'
                        }
                    }

                    request(optionsKB, function (err, res, body) {

                        if (err) {
                            console.log('Error querying the knowledge base', err);
                            return;
                        }

                        var neighbours = [];
                        for (var i = 0; i < body.results.bindings.length; i++) {
                            neighbours.push(body.results.bindings[i].variable.value);
                        }
                        var neigh1 = neighbours[0].split("#")[1];
                        var neigh2 = neighbours[1];
                        if(neigh2 != undefined){
                            neigh2 = neigh2.split("#")[1]
                        }
                        console.log('DEBUG 5: neigh1',  neighbours[0]);
                        console.log('DEBUG 5: neigh2',  neighbours[1]);


                        var status1query = sparqlgen.getInstanceProperty(neigh1,"hasStatus");
                        console.log('DEBUG 5: status1query',  status1query);

                        fuseki("query",status1query,'',function(status1) {
                            console.log('DEBUG 5: status1: ',  status1);
                            if(status1 == 'occupied'){
                                if(neigh1.charAt(5) == 3){
                                    var query = sparqlgen.getProductDetail(ref1.zone3ID, "currentneed");
                                    fuseki("query", query, '', function (need) {
                                        if (need == 'unload') {
                                            var reachlink1query = sparqlgen.reachNeighbourLinkQuery('zone_1_'+next_ws);
                                            console.log('DEBUG 5: reachlink1query: ',  reachlink1query);
                                            fuseki("query", reachlink1query, neigh1.charAt(5), function (link1) {
                                                console.log('DEBUG 5: link1: ',  link1);
                                                setTimeout(function(){
                                                    Orchestrator(link1);
                                                },1000);
                                            });
                                        }
                                    })
                                }
                                else{
                                    var reachlink1query = sparqlgen.reachNeighbourLinkQuery('zone_1_'+next_ws);
                                    console.log('DEBUG 5: reachlink1query: ',  reachlink1query);
                                    fuseki("query", reachlink1query, neigh1.charAt(5), function (link1) {
                                        console.log('DEBUG 5: link1: ',  link1);
                                        setTimeout(function(){
                                            Orchestrator(link1);
                                        },1000);
                                    });
                                }
                            }
                            else {
                                if(neigh2 != undefined) {
                                    var status2query = sparqlgen.getInstanceProperty(neigh2, "hasStatus");
                                    console.log('DEBUG 5: status2query', status2query);
                                    fuseki("query", status2query, '', function (status2) {
                                        console.log('DEBUG 5: status2: ', status2);
                                        if (status2 == 'occupied') {
                                            if(neigh2.charAt(5) == 3){
                                                var query = sparqlgen.getProductDetail(ref1.zone3ID, "currentneed");
                                                fuseki("query", query, '', function (need) {
                                                    if (need == 'unload') {
                                                        var reachlink2query = sparqlgen.reachNeighbourLinkQuery('zone_1_'+next_ws);
                                                        console.log('DEBUG 5: reachlink2query: ',  reachlink2query);
                                                        fuseki("query", reachlink2query, neigh2.charAt(5), function (link2) {
                                                            console.log('DEBUG 5: link2: ',  link2);
                                                            setTimeout(function(){
                                                                Orchestrator(link2);
                                                            },1000);
                                                        });
                                                    }

                                                })
                                            }
                                            else{
                                                var reachlink2query = sparqlgen.reachNeighbourLinkQuery('zone_1_'+next_ws);
                                                console.log('DEBUG 5: reachlink2query: ',  reachlink2query);
                                                fuseki("query", reachlink2query, neigh2.charAt(5), function (link2) {
                                                    console.log('DEBUG 5: link2: ',  link2);
                                                    setTimeout(function(){
                                                        Orchestrator(link2);
                                                    },1000);
                                                });
                                            }
                                        }
                                    })
                                }
                            }
                        })

                    })
                }


                break;
            case "PalletLoaded"://update PalletID to the first product in OrderClass`

                PalletID = req.body.payload.PalletID;
                UpdatePalletID(PalletID);
                break;
            case "PaperLoaded":

                var PalletID = ref1.zone3ID;
                var updatequery = sparqlgen.updatePropertyGivenProperty("hasPalletID", PalletID, "hasCurrentNeed", "frame");
                fuseki("update", updatequery, '', function () {
                    var subject = functions.getSubject(req.body.id, req.body.senderID);
                    var getNeighQuery = sparqlgen.getNeighbourQuery(subject, "hasNeighbour");
                    fuseki("query", getNeighQuery, 0, function (neighbour) {
                        var reachNeighLinkQuery = sparqlgen.reachNeighbourLinkQuery(neighbour);
                        fuseki("query", reachNeighLinkQuery, 0, function (link) {
                            Orchestrator(link);
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
                if ((Recipe > 0) && ((Recipe < 4))) {
                    nextneed = "screen";
                    console.log('FROM DRAW END EXECUTION: Setting Next need for Pallet: ' + PalletID + 'as screen');
                }
                else if ((Recipe > 3) && ((Recipe < 7))) {
                    nextneed = "keyboard";
                    console.log('FROM DRAW END EXECUTION: Setting Next need for Pallet: ' + PalletID + 'as keyboard');
                }
                else if ((Recipe > 6) && ((Recipe < 10))) {
                    nextneed = "unload";
                    var updatequery = sparqlgen.updatePropertyGivenProperty("hasPalletID", PalletID, "hasCurrentNeed", nextneed);
                    fuseki("update", updatequery, '', function () {
                        var subject = functions.getSubject('Z3_Changed', req.body.senderID);
                        var getNeighQuery = sparqlgen.getNeighbourQuery(subject, "hasNeighbour");
                        fuseki("query", getNeighQuery, '', function (neighbour) {
                            var nextzonestatusquery = sparqlgen.getInstanceProperty(neighbour, "hasStatus");
                            fuseki("query", nextzonestatusquery, '', function (nextstatus) {
                                if ((nextstatus == 'free') && (ref1.bypassflag == false)) {
                                    ref1.bypassflag = true;
                                    var reachNeighLinkQuery = sparqlgen.reachNeighbourLinkQuery(neighbour);
                                    fuseki("query", reachNeighLinkQuery, '3', function (link) {
                                        Orchestrator(link)
                                    })
                                }
                            });
                        });
                    });
                }

                if (nextneed != "unload") {
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
                                var need_colour_ = colour;
                                fuseki("query", getneedtype_query, '', function (type) {
                                    var need_type_ = type;
                                    var exec_process_query = sparqlgen.getInstanceProperty('robot_' + ws, 'hasExecuteProcess');
                                    fuseki("query", exec_process_query, '', function (process) {
                                        console.log('Need Colour: ' + need_colour_ + 'Need Type:  ' + need_type_);
                                        var url_query = sparqlgen.getInstanceProperty(process, 'hasUrl');
                                        fuseki("query", url_query, '', function (url) {
                                            console.log('Ref1.equipwith: ' + ref1.equip_with + 'Need Colour: ' + need_colour_);

                                            if (need_colour_ != ref1.equip_with) {
                                                console.log('MISMATCH FOUND BETWEEN NEED COLOUR: ' + need_colour_ + ' AND EQUIPPED WITH: ' + ref1.equip_with);
                                                console.log('EQUIPPING . . ');
                                                var equipwith = 'ChangePen' + need_colour_.toUpperCase();
                                                console.log('Equipwith', equipwith);
                                                optionsOrchestrator.body = url + equipwith;
                                                request(optionsOrchestrator, function (err, res, body) {
                                                    if (err) {
                                                        console.log('Error sending invoke  command to the orchestrator');
                                                    }

                                                    ref1.equip_with = need_colour_;

                                                });

                                            }
                                            setTimeout(function () {
                                                //GET DRAW URL NUMBER
                                                var drawnum = functions.getdrawnumber(need_type_);
                                                console.log('Draw Num: ' + drawnum + 'for Pallet: ' + PalletID + 'Purpose: ' + need_type_ + ' with colour: ', need_colour_);
                                                // optionsOrchestrator.body = url + drawnum;
                                                console.log('Draw URL: ' + optionsOrchestrator.body);
                                                Orchestrator(url + drawnum)
                                            }, 1000)
                                        })
                                    })
                                });
                            });

                        });
                    });
                }
                else {
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
        request.post('	http://localhost:3000/RTU/SimCNV' + ref1.wsnumber + '/events/Z5_Changed/notifs', {form: {destUrl: "http://localhost:600" + ref1.wsnumber + "/notifs/"}});
        if ((ref1.wsnumber != 1) && (ref1.wsnumber != 7)) {
            request.post('	http://localhost:3000/RTU/SimCNV' + ref1.wsnumber + '/events/Z4_Changed/notifs', {form: {destUrl: "http://localhost:600" + ref1.wsnumber + "/notifs/"}});
            request.post('http://localhost:3000/RTU/SimROB' + ref1.wsnumber + '/events/DrawEndExecution/notifs', {form: {destUrl: "http://localhost:600" + ref1.wsnumber + "/notifs/"}});

        }

    }
    if ((ref1.wsnumber > 9) && (ref1.wsnumber < 13)) {
        request.post('	http://localhost:3000/RTU/SimCNV' + ref1.wsnumber + '/events/Z1_Changed/notifs', {form: {destUrl: "http://localhost:60" + ref1.wsnumber + "/notifs/"}});
        request.post('	http://localhost:3000/RTU/SimCNV' + ref1.wsnumber + '/events/Z2_Changed/notifs', {form: {destUrl: "http://localhost:60" + ref1.wsnumber + "/notifs/"}});
        request.post('	http://localhost:3000/RTU/SimCNV' + ref1.wsnumber + '/events/Z3_Changed/notifs', {form: {destUrl: "http://localhost:60" + ref1.wsnumber + "/notifs/"}});
        request.post('	http://localhost:3000/RTU/SimCNV' + ref1.wsnumber + '/events/Z4_Changed/notifs', {form: {destUrl: "http://localhost:60" + ref1.wsnumber + "/notifs/"}});
        request.post('	http://localhost:3000/RTU/SimCNV' + ref1.wsnumber + '/events/Z5_Changed/notifs', {form: {destUrl: "http://localhost:60" + ref1.wsnumber + "/notifs/"}});
        request.post('http://localhost:3000/RTU/SimROB' + ref1.wsnumber + '/events/DrawEndExecution/notifs', {form: {destUrl: "http://localhost:60" + ref1.wsnumber + "/notifs/"}});

    }
    ref1.loadpen();
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

//METHOD LOAD PEN OF CLASS WORKSTATION TO LOAD PENS
workstation.prototype.loadpen = function () {
    var ref = this;
    var options;
    var temp = ref.equip_with;
    var equipment = temp.toUpperCase();

    var url = "http://127.0.0.1:3000/RTU/SimROB" + ref.wsnumber + "/services/ChangePen" + equipment;

    optionsOrchestrator.body = url;
    request(optionsOrchestrator, function (err) {

        if (err) {
            console.log('Error loading pen', err);
        }


    });
};

//INSTANTIATING OBJECTS OF CLASS WORKSTATION
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

//USING METHOD RUNSERVER OF WORKSTATION OBJECTS DEFINED ABOVE
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