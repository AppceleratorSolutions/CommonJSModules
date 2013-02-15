/*
Recognized parameters:
      imageListURL - string  (URL to JSON array of image names, if not available, imageList will be used)
      imageList    - array (array of image names to be added to imageURL, not used if imageListURL present)
      imageURL     - string (base url of images)
      defaultImage - string (preventDefaultImage set if not used)
      scrollable    - object (pass in your own scrollableView)
      scrollProps  - object  (pass in your own scrollable properties)
 
Sample Usage:
	var scrollable = remoteScroll({
		imageListURL:'http://winewebdesign.com/CustomLabel/borderCount.php', 
		imageURL:'http://winewebdesign.com/CustomLabel/borders/', 
		defaultImage:'KS_nav_ui.png'
	});
*/

function remoteScroll(params){
	var 
	remoteImageURLArr = [],
	length = null,
	isAndroid = Ti.Platform.osname === 'android',
	scrollable = params.scrollable?params.scrollable:Ti.UI.createScrollableView(params.scrollProps),
	// create the three containers that will carry the images in the scrollable view
	containers = [
	    Ti.UI.createImageView({ defaultImage: params.defaultImage?params.defaultImage:null, preventDefaultImage:params.defaultImage?false:true, top: 0, right: 0, bottom: 0, left: 0 }),
	    Ti.UI.createImageView({ defaultImage: params.defaultImage?params.defaultImage:null, preventDefaultImage:params.defaultImage?false:true, top: 0, right: 0, bottom: 0, left: 0 }),
	    Ti.UI.createImageView({ defaultImage: params.defaultImage?params.defaultImage:null, preventDefaultImage:params.defaultImage?false:true, top: 0, right: 0, bottom: 0, left: 0 })
	];
	
	containers[0].addEventListener('error', function(e){
		alert(e);
	})
	// set first visible page to 1	
	scrollable.currentPage = 1;
	// grab the list of remote images
	getImageList();
	// set the three containers as views in the scrollable view
	scrollable.views = containers;
	// add the scroll event listener
	scrollable.addEventListener('scrollEnd', scrollListener);
	
	function getImageList(){
		if(params.imageListURL){
			var client = Ti.Network.createHTTPClient({
			     // function called when the response data is available
			     onload : function(e) {
			     	
			        loadImages({data:JSON.parse(this.responseText)});
			     },
			     // function called when an error occurs, including a timeout
			     onerror : function(e) {
			         Ti.API.debug(e.error);
			         alert('Oops!  We are unable to reach our Images online.');
			     },
			     timeout : 8000  // in milliseconds
			 });
			 // Prepare the connection.
			 client.open("GET", params.imageListURL);
			 // Send the request.
			 client.send(); 
		 			
		} else if (params.imageList){
			loadImages({data:params.imageList});
		} else {
			alert('No Images Provided.')
		}
	}
	
	function loadImages(args){
		
		//load image array
		var arr = args.data;
		
		//get the array length
		length = arr.length
		
		if(length ==0){
			alert('There are no remote images available.')
		}
		
		for (var i = 0; i<length; i++){
			
			var remoteImageURL = params.imageURL+arr[i];

			remoteImageURLArr.push(remoteImageURL);
		}
		// preload first three views
		loadView({view:containers[0], rImage:0});
		loadView({view:containers[1], rImage:1});
		loadView({view:containers[2], rImage:2});
	}
	
	function loadView(args) {
	    // set the view and the rImage
		var view = args.view,
			rImage = args.rImage
		    rURL = encodeURI(remoteImageURLArr[rImage]);

		// set the rImage to the current view 
		
		view.image = rURL;
	   	view.count = rImage; 
	}
	
	function scrollListener(evt) {
	    var count = null;
	    // what is our current page?
	    switch (evt.currentPage) {
	        case 0: // scrolled to the left
				
		       if(evt.view.count!=0 && evt.view.count<length){
					count = evt.view.count-1
	        	} else if (evt.view.count==0){
		        	count = length-1;
		        } else {
		        	count = 0;
		        }
	        
	            // so pop a view off the end, and put it at the start
	           containers.unshift(containers.pop());
	            if (isAndroid) {
	                // temporarily remove our event listener (for Android's sake...)
	                scrollable.removeEventListener('scrollEnd', scrollListener);
	            }
	            // reset the counter so we are back in the middle
	            scrollable.setCurrentPage(1);
	            // reset our views array
	            scrollable.views = containers;
	            if (isAndroid) {
	                // now we can add the event listener again
	                scrollable.addEventListener('scrollEnd', scrollListener);
	            }
	            // and now buffer load the view we reset
	            loadView({view:containers[0], rImage:count});
	            
	            break;
	        case 2: // scrolled to the right
	        	if(evt.view.count<length-1){
					count = evt.view.count+1
	        	} else {
		        	count = 0;
		        } 
				
	           // so shift a view off the start, and put it at the end
	           containers.push(containers.shift());
	           
	           if (isAndroid) {
	                // temporarily remove our event listener (for Android's sake...)
	           		scrollable.removeEventListener('scrollEnd', scrollListener);
	           }
	            // reset the counter so we are back in the middle
	            scrollable.setCurrentPage(1);
	            // reset our views array
	            scrollable.views = containers;
	            if (isAndroid) {
	                // now we can add the event listener again
	                scrollable.addEventListener('scrollEnd', scrollListener);
	            }
				// and now buffer load the view we reset
	            loadView({view:containers[2], rImage:count});
	            
	            break;
	    }
	}
	//return the scrollable view to from the module
	if(!params.scrollable){
		return scrollable;
	}
}

module.exports = remoteScroll;