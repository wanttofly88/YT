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
	'menu/mobile-menu-drag.view',
	'slider/slider.view',
	'slider/slider-arrows.view',
	'slider/slider-slides.view',
	'preload/preload.view',
	'trigger/trigger.view',
	'trigger/scroll-trigger.view',
	'form/form.view',
	'form/form-focus.view',
	'form/form-responce.view',
	'popup/popup.view',
	'popup/popup-controls.view',
	'popup/popup-close.view',
	'overlay/overlay.view',
	'selects/selects.view',
	'selects/selects-display.view'
	], function(
		domReady,
		vhUnits,
		mainMinHeight,
		mobileMenu,
		mobileMenuBtn,
		mobileMenuDrag,
		slider,
		sliderArrows,
		sliderSlides,
		preload,
		trigger,
		scrollTrigger,
		form,
		formFocus,
		formRespocnce,
		popup,
		popupControls,
		popupClose,
		overlay,
		selects,
		selectsDisplay
	) {
	domReady(function () {
		vhUnits.init();
		mainMinHeight.init();
		mobileMenu.init();
		mobileMenuBtn.init();
		mobileMenuDrag.init();
		slider.init();
		sliderArrows.init();
		sliderSlides.init();
		preload.init();
		trigger.init();
		scrollTrigger.init();
		form.init();
		formFocus.init();
		formRespocnce.init();
		popup.init();
		popupControls.init();
		popupClose.init();
		overlay.init();
		selects.init();
		selectsDisplay.init();
	});
});