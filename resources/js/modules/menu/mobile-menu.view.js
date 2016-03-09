define(['dispatcher', 'menu/mobile-menu.store', 'TweenMax'], function(dispatcher, store, TweenMax) {

	"use strict";

	var main, footer;
	var menu;
	var overlay;
	var status = 'inactive';

	var _handleChange = function() {
		var storeData = store.getData();

		if (status === storeData.status) return;

		status = storeData.status;
		if (status === 'active') {
			TweenMax.to(menu, 0.3, {
				x: 0,
				ease: Cubic.easeOut 
			})
			TweenMax.to([main, footer], 0.3, {
				x: 100,
				ease: Cubic.easeOut 
			})
			if (overlay) {
				overlay.classList.add('active');
			}
		}
		if (status === 'inactive') {
			TweenMax.to(menu, 0.3, {
				x: -250,
				ease: Cubic.easeOut
			})
			TweenMax.to([main, footer], 0.3, {
				x: 0,
				ease: Cubic.easeOut 
			})
			if (overlay) {
				overlay.classList.remove('active');
			}
		}
	}

	var _handleMutate = function() {
		main = document.getElementsByTagName('main')[0];
		menu = document.getElementsByClassName('mobile-menu')[0];
		footer = document.getElementsByTagName('footer')[0];
		overlay = document.getElementsByClassName('mobile-menu-overlay')[0];

		if (!main || !footer || !menu) {
			console.warn('menu structure corrupted');
			return;
		}


	}

	var init = function() {
		_handleMutate();
		_handleChange();

		store.eventEmitter.subscribe(_handleChange);

		dispatcher.subscribe(function(e) {
			if (e.type === 'mutate') {
				_handleChange();
			}
		});
	}

	return {
		init: init
	}
});