/*This is a simple module that requires a map, an annotation and a parent view and will return the X & Y coordinates o fthe parent view of the provided annotation based on its latitude and longitude.
*
*  PARAMS:
* -annotation {Ti.Map.Annotaion object}: The annotation you want to return the coordinates for
* -map {Ti.Map.View object}: The map with that contains the annotation
* -view {Ti.UI.View object}: The view in which you want the x/y coordinates
* -callback{function}: Use a callback or just return the point value if callback is null
* 
* Full example here: https://gist.github.com/alanleard/4759405
*/

function convertMapPoints(params){
   if(!params || !params.map || !params.annotation || !params.view){
       Ti.API.error("convertMapPoints Module missing required parameters.");
       return
   }
   
    var map = params.map,
        pointView = params.view,
        pin = params.annotation,
        _callback = params.callback || null,
        
        region = map.region,
        width = map.size.width,
        height = map.size.height,
        bounds = {},
        referenceView = Ti.UI.createView({touchEnabled:false});
    
    map.add(referenceView);

    bounds.north = parseFloat(region.latitude) + parseFloat(region.latitudeDelta) / 2.0;
 
    bounds.west = parseFloat(region.longitude) - parseFloat(region.longitudeDelta) / 2.0;
 
    bounds.east = parseFloat(region.longitude) + parseFloat(region.longitudeDelta) / 2.0;
 
    bounds.south = parseFloat(region.latitude) - parseFloat(region.latitudeDelta) / 2.0;
    
    if(bounds.north>bounds.south){
        var hSize = ( bounds.north - bounds.south ) / height;
        var y = Math.round(( bounds.north-pin.latitude)/hSize);
    } else {
        var hSize = ( bounds.south - bounds.north ) / height;
        var y = Math.round(( pin.latitude-bounds.north )/hSize);
    }
    
    if(bounds.west>bounds.east){
        var wSize = ( bounds.west - bounds.east ) / width;
        var x = Math.round(( pin.longitude - bounds.east )/wSize);
    } else {
        var wSize = ( bounds.east - bounds.west ) / width;
        var x = Math.round(( pin.longitude - bounds.west )/wSize);
    }
    
    var point = referenceView.convertPointToView({x:x, y:y}, pointView);
    
    map.remove(referenceView);
    
    referenceView = null;
    if(_callback){
        _callback(point)
    } else {
        return point;
    }  
};

module.exports = convertMapPoints; 