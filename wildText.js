/*
WildText CommonJS module for Appcelerator Titanium
 
Create dynamic gradient filled text in your iOS Applications using this simple module.
 
@params :   text 	- String. The text for your label
			font 	- Font.  Specify the font attributes for the label (defaults to standard size, weight and family),
			backgroundGradient - BackgroundGradient. Specify your backgroundGradient object (defaults to White to Black linear gradient),
			Top 	- Integer. Top property for your label,
			Left 	- Integer. Left Property for your Label,
			Bottom  - Integer. Bottom Property for your Label,
			Right	- Integer. Right Property for your Label
			
Example Usage:
 
var WildText = require("wildText");
 
var win = Ti.UI.createWindow();
var text = new WildText({
	text: "Custom Gradient and Font",
	backgroundGradient:{
		type: 'linear',
		startPoint:{x:0, y:0},
		endPoint: {x:0, y:"100%"},
		colors:[
			{color: "#f00", offset:0.2},
			{color: "#fff", offset: 0.5},
			{color: "#00f", offset:0.7}
		],
	},
	font: {
		fontSize: 30,
		fontWeight: "bold"
	},
	top: 10,
});
 
win.add(text);
win.open();
 
*/
 
 
var WildText = function(_args){
	
	_args = _args || {};
	
	var FOLDER_PATH = Ti.Filesystem.tempDirectory;
	var filename = _args.text.replace(" ", "_");
	
	this.labelImageFile = Ti.Filesystem.getFile(FOLDER_PATH, filename + "_text.png");
	if (this.labelImageFile.exists()) {
		Ti.API.info("Reading " + this.labelImageFile.nativePath);
		this.label = this.labelImageFile.read();
	} else {
		// Create an image from the Label to get the masked Text
		this.label = Ti.UI.createLabel({
			text: _args.text,
			color: "#000",
			font: _args.font || {
				fontSize: "24dp",
				fontFamily: "Calibri",
				fontWeight: "bold"
			},
			backgroundColor: "transparent",
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE
		}).toImage();
		Ti.API.info("Writing " + this.labelImageFile.nativePath);
		this.labelImageFile.write(this.label);
	}
	
	this.bkgImageFile = Ti.Filesystem.getFile(FOLDER_PATH, filename + "_bkg.png");
	if (!this.bkgImageFile.exists()) {
		this.background = Ti.UI.createView({
			width: this.label.width, 
			height: this.label.height,
			backgroundGradient: _args.backgroundGradient || {
				type: 'linear',
				startPoint:{x:0, y:0},
				endPoint: {x:0, y:"100%"},
				colors:[
					{color: "#fff", offset:0.0},
					{color: "#000", offset:1.0}
				],
			}
		}).toImage();
		
		Ti.API.info("Writing " + this.bkgImageFile.nativePath);
		this.bkgImageFile.write(this.background);
	}
 
	var API = Titanium.UI.createMaskedImage({
	    image : this.bkgImageFile.nativePath , // alpha mask
	    mask : this.labelImageFile.nativePath, // image to mask
	    mode : Titanium.UI.iOS.BLEND_MODE_SOURCE_IN, 
	    height: this.label.height,
	    width: this.label.width,
	    top: _args.top || null,
	    left: _args.left || null,
	    right: _args.right || null,
	    bottom: _args.bottom || null
	});	
	
	return API;
};
module.exports = WildText;
