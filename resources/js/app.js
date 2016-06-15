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
	'slider/slider-masked.view',
	'slider/slider-arrows.view',
	'slider/slider-slides.view',
	'slider/slider-progressbar.view',
	'slider/slider-controls.view',
	'preload/preload.view',
	'trigger/trigger.view',
	'trigger/scroll-trigger.view',
	'form/form.view',
	'form/form-focus.view',
	'form/form-responce.view',
	'popup/popup.view',
	'popup/popup-controls.view',
	'popup/popup-close.view',
	'popup/cart-popup.view',
	'overlay/overlay.view',
	'selects/selects.view',
	'selects/selects-display.view',
	'cart/cart.view',
	'cart/cart-number.view',
	'cart/cart-price-total.view',
	'cart/cart-remove-all.view',
	'cart/cart-number-total.view',
	'cart/cart-add.view',
	'cart/cart-get.view',
	'drop-down/drop-down.view',
	'drop-down/drop-down-controls.view',
	'drop-down/drop-down-contacts.view',
	'map/map.view',
	'map/map-markers.view',
	'map/map-controls.view',
	'video/video-main.view',
	'decor/group-hover.view'
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
		sliderProgressbar,
		sliderControls,
		preload,
		trigger,
		scrollTrigger,
		form,
		formFocus,
		formRespocnce,
		popup,
		popupControls,
		popupClose,
		cartPopup,
		overlay,
		selects,
		selectsDisplay,
		cart,
		cartNumber,
		cartPriceTotal,
		cartRemoveAll,
		cartNumberTotal,
		cartAdd,
		cartGet,
		dropDown,
		dropDownControls,
		dropDownContacts,
		map,
		mapMarkers,
		mapControls,
		videoMain,
		groupHover
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
		sliderProgressbar.init();
		sliderControls.init();
		preload.init();
		trigger.init();
		scrollTrigger.init();
		form.init();
		formFocus.init();
		formRespocnce.init();
		popup.init();
		popupControls.init();
		popupClose.init();
		cartPopup.init();
		overlay.init();
		selects.init();
		selectsDisplay.init();
		cart.init();
		cartNumber.init();
		cartPriceTotal.init();
		cartRemoveAll.init();
		cartNumberTotal.init();
		cartAdd.init();
		cartGet.init();
		dropDown.init();
		dropDownControls.init();
		dropDownContacts.init();
		map.init();
		mapMarkers.init();
		mapControls.init();
		videoMain.init();
		groupHover.init();
	});
});