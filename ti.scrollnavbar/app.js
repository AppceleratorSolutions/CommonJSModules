var ScrollNavBar = require('ti.scrollnavbar');

var win = Ti.UI.createWindow({
	backgroundColor: 'white'
});

var colors = ['red', 'green', 'blue', 'pink', 'yellow'];
var views = [];

for (var i=0; i<5; i++) {
	var view = Ti.UI.createScrollView({
		backgroundColor: colors[i],
		left: 20,
		top: 20,
		right: 20,
		bottom: 20
	});
	
	var label = Ti.UI.createLabel({
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vitae dui augue. Praesent egestas pulvinar enim, vehicula malesuada ligula dignissim id. Morbi semper malesuada erat ut ullamcorper. Nullam vitae egestas massa. Phasellus egestas massa quis ligula dapibus et rhoncus arcu pharetra. Morbi eleifend dictum placerat. Aenean mollis faucibus velit, vel bibendum nisi elementum nec. Fusce at lorem sit amet turpis volutpat placerat. Mauris id aliquet lectus. Integer vel nulla sed ipsum dapibus condimentum quis non mauris. In lorem tellus, iaculis ac volutpat vel, porttitor in ipsum. Aliquam commodo diam imperdiet risus molestie eu facilisis enim mollis. Nam accumsan, ipsum ac viverra suscipit, elit mauris mollis ligula, vitae lacinia enim orci eget nulla. Phasellus ipsum libero, dapibus a tristique in, commodo eget mi. In ultricies cursus mauris, ut porta ante pulvinar ac. Phasellus elit velit, vulputate vel feugiat ut, aliquet nec eros. Nulla metus eros, rhoncus sit amet egestas congue, placerat vel odio. Integer eget leo eget nisl blandit sagittis. Aliquam erat volutpat. Sed eleifend sagittis nulla, eget lobortis orci accumsan quis. Nam a dui massa. Curabitur porta mi sed enim suscipit quis hendrerit ipsum bibendum. Fusce ultrices placerat massa vitae porta. Pellentesque vitae justo a tellus posuere sodales. Integer pretium convallis pulvinar. Duis neque ligula, ultrices sed mollis sed, viverra non sapien. In pharetra pulvinar ipsum, ut faucibus nisl ullamcorper et. Mauris condimentum, erat a imperdiet placerat, mi nisi condimentum nibh, in porttitor orci arcu et felis. Donec gravida urna non dui fringilla vel porta sem porttitor. Nam commodo, augue ac semper hendrerit, nisl odio sollicitudin ligula, id aliquam sem lorem a neque. Fusce euismod tellus sed mi sagittis aliquam.",
		color: 'black'
	});
	
	view.add(label);
	
	views[i] = view
}

var scrollable = ScrollNavBar({
	titles: ['Uno', 'Due', 'Tre', 'Quattro', 'Cinque'],
	views: views,
	bar: {
		backgroundColor: '#a00',
		height: 50
	},
	title: {
		color: 'white'
	}
});

win.add(scrollable);

win.open();
