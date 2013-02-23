/**
 * Dependencies
 */
var ACS = require('ti.cloud');
 
/**
 * CloudImage Definition
 */
 
var CloudImage = function(_args) {
  
  _args = _args || {};
 
  var API = Ti.UI.createImageView({
    height: _args.height || Ti.UI.SIZE,
  	width: _args.width || Ti.UI.SIZE,
  }); 
  API.PHOTO_SIZE = {
  	THUMB	: 	'thumb_100',
  	SQUARE	: 	'square_75',
  	SMALL	:	'small_240',
  	MEDIUM500: 	'medium_500',
  	MEDIUM640: 	'medium_640',
  	LARGE	: 	'large_1024',
  	ORIGINAL: 	'original'	
  };
  API.defaultSize = _args.size || API.PHOTO_SIZE.SQUARE;
  API.defaultIcon = _args.defaultIcon || null;
  
    /**
   * updateImage
   * Downloads the urls associated with the image, and assigns the correct url to the image parameter
   * of the UIIMageView based on the size requirement
   * 
   * @param _id : ACS ID of Photo
   * @param _size : One of the designated PHOTO_SIZE options for the Photo (optional)
   */
  API.updateImage = function(_id, _size){
  	//Default to class default size if no size param is specified
  	_size = _size || API.defaultSize;
  	
  	ACS.Photos.show({photo_id: _id}, function(e){
		if(e.success && e.photos.length) {
  			API.urls = e.photos[0].urls;
  			Ti.API.info(API.urls[_size]);	
  			API.image = API.urls[_size];
  		}
  		else {
  			
  		}
	});
  };
  
  /**
   * updateImageSize
   * Updates the image with a particular size by setting the image param of the UIImageView
   * to the corresponding url
   * 
   * @param _size : One of the designated PHOTO_SIZE options for the Photo (optional)
   */
  API.updateImageSize = function(_size) {
  	//Default to class default size if no size param is specified
  	_size = _size || API.defaultSize;
  	
  	if(API.urls) {
  		API.image = API.urls[_size];
  	}
  };
  
  API.updateImage(_args.id)
  
  return API;
}; /* end CloudImage */  
module.exports = CloudImage;  
