/**
 * Created by Joe David on 22-11-2017.
 */
var prefix_iii = "PREFIX iii:<http://www.manufacturing.owl#>";
order_inst=1;

module.exports = {


    createInstance: function (classname) {

    var query = "update= "+ prefix_iii +  " INSERT DATA {iii:"+classname+"_"+order_inst+" a iii:"+classname+".}";
        order_inst++;
    return query;
    },
    createInstanceProperty: function (instance_name, property_name,property_value) {
        var query = "update= "+ prefix_iii +  " INSERT DATA {iii:"+instance_name+" iii:"+property_name+" '"+property_value+"'.}";
        //
        return query;
    }
};
