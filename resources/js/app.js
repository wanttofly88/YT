"use strict";

var path;
var pathElements =  document.getElementsByName('resources-path');
if (pathElements && pathElements.length) {
	path = pathElements[0].content;
} else {
	path = document.getElementsByTagName('head')[0].getAttribute('data-path');
}

if (path.slice(-1) !== '/') path += '/';

require.config({
	baseUrl: path + 'js/modules',
	paths: {
		TweenMax: '../libs/TweenMax',
		swipe: '../libs/swipe',
		fastClick: '../libs/fstClick'
	},
	shim: {

	}
});


require([
	'domReady',
	'resize/vhUnits.view',
	'resize/main-minHeight.view',
	'menu/mobile-menu.view',
	'menu/mobile-menu-btn.view',
	'menu/mobile-menu-drag.view'
	], function(
		domReady,
		vhUnits,
		mainMinHeight,
		mobileMenu,
		mobileMenuBtn,
		mobileMenuDrag
	) {
	domReady(function () {
		vhUnits.init();
		mainMinHeight.init();
		mobileMenu.init();
		mobileMenuBtn.init();
		mobileMenuDrag.init();
	});
});