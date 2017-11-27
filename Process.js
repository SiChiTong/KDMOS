/**
 * Created by Joe David on 25-11-2017.
 */


var Process= function (reachZone, ReachLink1, ReachLink2,ROB1DrawUrl,ROB2DrawUrl,ROB3DrawUrl,ROB4DrawUrl,ROB5DrawUrl,ROB6DrawUrl,ROB7DrawUrl,ROB8DrawUrl,ROB9DrawUrl,ROB10DrawUrl,ROB11DrawUrl,ROB12DrawUrl)
{
    this.hasreachZone = reachZone;
    this.hasreachLink1 = ReachLink1;
    this.hasReachLink2 = ReachLink2;
    this.hasROB1DrawUrl = '';
    this.hasROB2DrawUrl = '';
    this.hasROB3DrawUrl = '';
    this.hasROB4DrawUrl = '';
    this.hasROB5DrawUrl = '';
    this.hasROB6DrawUrl = '';
    this.hasROB7DrawUrl = '';
    this.hasROB8DrawUrl = '';
    this.hasROB9DrawUrl = '';
    this.hasROB10DrawUrl = '';
    this.hasROB11DrawUrl = '';
    this.hasROB12DrawUrl = '';

};

Process.prototype.returnLink = function (reachZone){
    for(var i=0;i<transport.length; i++){
        if(transport.hasreachZone == reachZone){
            return (transport.hasreachLink1);
        }
    }

}

var draw1 =  new Process('','','','','','','','','','','','','','');
var transport = new Array();
transport.push(new Process('zone5_7','http://localhost:3000/RTU/SimCNV7/services/TransZone35'));
transport.push(new Process('zone5_7','http://localhost:3000/RTU/SimCNV7/services/TransZone35'));