/*
 * ti.mapcluster
 *
 * Copyright (c) 2012 Davide Cassenti
 * Copyright (c) 2008 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://github.com/davidecassenti/ti.mapcluster
 *
 */
function TiMapCluster(_mapOptions, _markers) {
	this.mapview = Titanium.Map.createView(_mapOptions);
	
	this.markers = _markers || [];
	this.clustered = [];
	this.mapview.TiMapCluster = this;
	
	this.mapview.addEventListener('regionChanged', this._autoUpdate);
}

TiMapCluster.prototype.setMarkers = function(_markers) {
	this.markers = _markers;
	this.mapview.TiMapCluster = this;
	this._update();
}

TiMapCluster.prototype.addMarker = function(_marker) {
	this.markers.push(_marker);
	this.mapview.TiMapCluster = this;
	this._update();
}

TiMapCluster.prototype.resize = function(_w, _h) {
	this.mapview.width = _w;
	this.mapview.height = _h;
}

TiMapCluster.prototype.setPosition = function(_x, _y) {
	this.mapview.left = _x;
	this.mapview.top = _y;
}

TiMapCluster.prototype._pixelDistance = function(_lat1, _lon1, _lat2, _lon2) {
	var region = this.mapview.actualRegion || this.mapview.region;
	
    var latPx = (this.mapview.size.height * Math.abs(_lat1 - _lat2)) / (region.latitudeDelta);
    var lonPx = (this.mapview.size.width * Math.abs(_lon1 - _lon2)) / (region.longitudeDelta);
    
    var distance = Math.sqrt(Math.pow((latPx),2) + Math.pow((lonPx),2));
        
    return distance;
}
	
TiMapCluster.prototype._cluster = function() {
    var clustered = [];
    var markers = [];
    
    for(var i in this.markers) {
    	markers.push(this.markers[i]);
    }
    
    /* Loop until all markers have been compared. */
    while (markers.length > 0) {
        var marker  = markers.pop();
        var cluster = [];
        
        /* Compare against all markers which are left. */
        for(var key = markers.length; key > -1; key--) {
        	var target = markers[key];
	        if(typeof target != "undefined") {
	            var pixels = this._pixelDistance(marker.latitude, marker.longitude,
	                                    target.latitude, target.longitude);
	                                    
	            /* If two markers are closer than given distance remove */
	            /* target marker from array and add it to cluster.      */
	            if (20 > pixels) {
	                markers.splice(key, 1);
	                cluster.push(target);
	            }
	        }
        }

        /* If a marker has been added to cluster, add also the one  */
        /* we were comparing to and remove the original from array. */
       
       	cluster.push(marker);
       	
       	var size = (cluster.length < 10) ? cluster.length : 10;
       	
       	var title = "";
       	for(var i=0; i<cluster.length; i++) {
       		title += cluster[i].title + " ";
       	}
       	
       	var midPoint = this._midPoint(cluster);
       	
		var annotation = {
			latitude: midPoint.latitude,
    		longitude: midPoint.longitude,
    		title: title,
    		cluster: cluster,
    		image: 'pins/' + size + '.png'
    	};
    	
    	clustered.push(annotation);
    }
    
    this.clustered = clustered;
    
    return clustered;
}

TiMapCluster.prototype._update = function() {
    var clustered = this._cluster();
    
	this.mapview.removeAllAnnotations();
	for(var i=0; i<clustered.length; i++) {
		this.mapview.addAnnotation(Titanium.Map.createAnnotation(clustered[i]));
	}
}

TiMapCluster.prototype._autoUpdate = function(e) {
	var self = this.TiMapCluster;
	
	this.actualRegion = {
		latitude: e.latitude,
		longitude: e.longitude,
		latitudeDelta: e.latitudeDelta,
		longitudeDelta: e.longitudeDelta
	};
	
	self._update();
}

TiMapCluster.prototype._midPoint = function(_points) {
	var sumLat = 0;
	var sumLon = 0;
	
	for(var i in _points) {
		sumLat += _points[i].latitude;
		sumLon += _points[i].longitude;
	}
	
	return {
		latitude: sumLat / _points.length,
		longitude: sumLon / _points.length
	}
}

module.exports = TiMapCluster;