/**
 * Created by Joe David on 22-11-2017.
 */
const prefix_iii = "PREFIX iii:<http://www.manufacturing.com/ontology.owl#>";
product_inst=1;

module.exports = {

    //FUNCTION CREATE INSTANCE OF CLASS/SUBCLASS
    createInstance: function (classname) {

    var query = "update= "+ prefix_iii +  " INSERT DATA {iii:"+classname+"_"+product_inst+" a iii:"+classname+".}";
        product_inst++;
    return query;
    },
    //FUNCTION TO CREATE PROPERTIES OF INSTANCES OF CLASS/SUBCLASS
    createInstanceProperty: function (instance_name, property_name,property_value) {
        var query = "update= "+ prefix_iii +  " INSERT DATA {iii:"+instance_name+" iii:"+property_name+" '"+property_value+"'.}";
        //
        return query;
    },
    getInstanceProperty: function(subject, predicate){
        var query = "query= "+ prefix_iii +  " SELECT * WHERE {iii:"+subject+" iii:"+predicate+" ?variable.}";
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
        var query = "query= "+ prefix_iii +  " ASK{ iii:Product_"+product_num+" a iii:Product.}";
        return query;
    },

    updateProperty: function(subject, predicate, object){
        var query = "update= "+ prefix_iii +  " DELETE{ iii:"+subject+" iii:"+predicate+" ?o. } INSERT { iii:"+subject+" iii:"+predicate+" '"+object+"'} WHERE { iii:"+subject+" iii:"+predicate+" ?o. }";
        return query;
    },

    getProductDetail: function(palletID,detail){
        var query = "query= "+ prefix_iii +  " SELECT ?"+detail+" WHERE {?s iii:hasPalletID '"+palletID+"'. ?s iii:hasFrameType ?frametype. ?s iii:hasFrameColour ?framecolour. ?s iii:hasKeyboardType ?keyboardtype. ?s iii:hasKeyboardColour ?keyboardcolour. ?s iii:hasScreenType ?screentype. ?s iii:hasScreenColour ?screencolour.  ?s iii:hasCurrentNeed ?currentneed.}";
        return query;
    },
    updatePropertyGivenProperty: function(givenproperty,givenpropertyvalue, updateproperty,updatepropertyvalue){
        var query = "update= "+ prefix_iii +  " DELETE{ ?s iii:"+updateproperty+" ?o. } INSERT { ?s iii:"+updateproperty+" '"+updatepropertyvalue+"'.} WHERE { ?s iii:"+givenproperty+" '"+givenpropertyvalue+"'. ?s iii:"+updateproperty+" ?o. }";
        return query;
    },
    getPreviousNeighbour: function(zone){
        var query = "query= "+ prefix_iii +  " SELECT * WHERE {?variable iii:hasNeighbour iii:"+zone+".}";
        return query;
    },



};
