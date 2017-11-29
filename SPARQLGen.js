/**
 * Created by Joe David on 22-11-2017.
 */
const prefix_iii = "PREFIX iii:<http://www.manufacturing.com/ontology.owl#>";
order_inst=1;

module.exports = {

    //FUNCTION CREATE INSTANCE OF CLASS/SUBCLASS
    createInstance: function (classname) {

    var query = "update= "+ prefix_iii +  " INSERT DATA {iii:"+classname+"_"+order_inst+" a iii:"+classname+".}";
        order_inst++;
    return query;
    },
    //FUNCTION TO CREATE PROPERTIES OF INSTANCES OF CLASS/SUBCLASS
    createInstanceProperty: function (instance_name, property_name,property_value) {
        var query = "update= "+ prefix_iii +  " INSERT DATA {iii:"+instance_name+" iii:"+property_name+" '"+property_value+"'.}";
        //
        return query;
    },

    getNeighbourQuery: function(subject, predicate){
        var query = "query= "+ prefix_iii +  " SELECT * WHERE {iii:"+subject+" iii:"+predicate+" ?variable.}";
        return query;
    },
    reachNeighbourLinkQuery: function(neighbour){
        var query = "query= "+ prefix_iii +  " SELECT ?variable WHERE {?subject iii:hasLinkDest iii:"+neighbour+". ?subject iii:hasReachLink ?variable.}";
        return query;
    },

    checkOrder: function(product_num){
        var query = "query= "+ prefix_iii +  " ASK{ iii:product_"+product_num+" a iii:Product.}";
        return query;
    },
};
