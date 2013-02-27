var TiMapCluster = require('ti.mapcluster');

var win = Ti.UI.createWindow({ backgroundColor: 'black' });
win.open();

var markers = [
	{
		title: 'marker_1',
		latitude: 59.441193,
		longitude: 24.729494
	},
	{
		title: 'marker_2',
		latitude: 59.432365,
		longitude: 24.742992
	},
	{
		title: 'marker_3',
		latitude: 59.431602,
		longitude: 24.757563
	},
	{
		title: 'marker_4',
		latitude: 59.437843,
		longitude: 24.765759
	},
	{
		title: 'marker_5',
		latitude: 59.439644,
		longitude: 24.779041
	},
	{
		title: 'marker_6',
		latitude: 59.434776,
		longitude: 24.756681
	}
];

var mapCluster = new TiMapCluster({
    mapType: Titanium.Map.STANDARD_TYPE,
    region: {latitude:0, longitude:0, 
            latitudeDelta:10, longitudeDelta:10},
    animate:true,
    regionFit:true,
    userLocation: false,
    width: Ti.UI.FILL,
    height: Ti.UI.FILL
}, markers);

win.add(mapCluster.mapview);

