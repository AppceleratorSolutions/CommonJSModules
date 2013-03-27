/**
 * ScrollNavBar
 * A navigation bar with scrolling titles
 *
 * @author Davide Cassenti <davide.cassenti@gmail.com>
 *
 */

(function() {
	function ScrollNavBar(options) {
		var psf = 1; // pixel scaling factor
		if (Ti.Platform.osname == "android") {
			psf = Ti.Platform.displayCaps.logicalDensityFactor;
		}
		
		if (!options || !options.titles || !options.views || (options.titles.length != options.views.length)) {
			return null;
		}
		
		var root = Ti.UI.createView({
			left: 0,
			top: 0,
			bottom: 0,
			right: 0,
			layout: 'vertical'
		});
		
		var labels = options.titles;
		var contents = options.views;
		var barOpt = options.bar || {};
		var titleOpt = options.title || {}
		
		var titles = [];
		var views = [];	
		var currentPage = 0;
		
		function updateBar(e) {
			if (e && e.currentPage === undefined)
				return;
				
			if (e && e.currentPageAsFloat == e.currentPage && e.currentPage != currentPage)
				currentPage = e.currentPage;
		
			var page = currentPage;
			var f = (e && e.currentPageAsFloat) ? (e.currentPageAsFloat-page) : 0;
			var barSize = Ti.Platform.displayCaps.platformWidth;
			
			var cw = titles[page].size.width;
			var left = ((1-f) * (barSize - cw)) / 2;
				
			titles[page].left = left / psf;
			titles[page].right = null;
			titles[page].opacity = 1 * (1-(Math.abs(f)/1.75));
			
			for (i=0; i<titles.length; i++) {
				var w = titles[i].size.width;
				
				if (i == (page-1)) {
					titles[i].opacity = 0.5;
					titles[i].right = null;
					
					if (left < w)
						titles[i].left = (left - w) / psf;
					else if ((page+1) < titles.length && (left + cw) > (barSize-titles[page+1].size.width))
						titles[i].left = -(((barSize-titles[page+1].size.width) - left - cw) / psf);
					else
						titles[i].left = 0;
				} else if (i == (page+1)) {
					titles[i].opacity = 0.5;
					titles[i].left = null;
					
					if ((left + cw) > (barSize-w))
						titles[i].right = ((barSize-w) - left - cw) / psf;
					else if ((page-1) >= 0 && left < titles[page-1].size.width)
						titles[i].right = (titles[page-1].size.width - left) / psf;
					else if (left < titles[page].size.width)
						titles[i].right = (titles[page].size.width - left) / psf;
					else
						titles[i].right = 0;
				} else if (i != page) {
					titles[i].opacity = 0;	
				}
			}
		}
		
		// create the navigation bar
		barOpt = barOpt || {};
		barOpt.left = 0;
		barOpt.right = 0;
		barOpt.top = 0;
		barOpt.width = Ti.UI.FILL;
		barOpt.height = (barOpt.height || 100) *  psf;
		barOpt.layout = 'absolute';
		
		var bar = Ti.UI.createView(barOpt);
		
		// create title labels and fix views options
		titleOpt.height = barOpt.height;
		titleOpt.opacity = 0;
		
		for (var t=0; t<labels.length; t++) {
			titleOpt.text = labels[t];
			var title= Ti.UI.createLabel(titleOpt);
			titles[t] = title;
			bar.add(title);
			
			Ti.API.info("top: " + barOpt.height);
			
			var content = Ti.UI.createView({
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				layout: 'absolute',
				backgroundColor: 'yellow'
			});
			
			content.add(contents[t]);
			
			views[t] = content;
		}
		
		var scrollable = Ti.UI.createScrollableView({
			views: views,
			layout: 'absolute'
		});
		
		scrollable.addEventListener('scroll', updateBar);

		root.add(bar);
		root.add(scrollable);
		
		root.addEventListener('postlayout', function createBar() {
			updateBar();
			root.removeEventListener('postlayout', createBar);
		});
		
		Ti.Gesture.addEventListener('orientationchange', function rotateDevice() {
			updateBar();
		});
		
		return root;
	}

	module.exports = ScrollNavBar;
})();