define(['dispatcher', 'menu/mobile-menu.store', 'resize/breakpoint.store', 'TweenMax'], function(dispatcher, store, bpStore, TweenMax) {

	"use strict";

	var main, footer;
	var menu;
	var overlay;
	var status = 'inactive';
	var body;
	var map;

	var _preventTouchScroll = function(e) {
		e.preventDefault();
	}

	var _handleChange = function() {
		var storeData = store.getData();

		if (status === storeData.status) return;

		status = storeData.status;
		if (status === 'active') {
			body.addEventListener('touchmove', _preventTouchScroll);
			body.classList.add('prevent-scroll');
			TweenMax.to(menu, 0.3, {
				x: 0,
				ease: Cubic.easeOut 
			})
			TweenMax.to([main, footer], 0.3, {
				x: 100,
				ease: Cubic.easeOut 
			})
			if (map) {
				TweenMax.to([map], 0.3, {
					x: 100,
					ease: Cubic.easeOut 
				})
			}
			if (overlay) {
				overlay.classList.add('active');
			}
		}
		if (status === 'inactive') {
			body.removeEventListener('touchmove', _preventTouchScroll);
			body.classList.remove('prevent-scroll');
			TweenMax.to(menu, 0.3, {
				x: -250,
				ease: Cubic.easeOut
			})
			TweenMax.to([main, footer], 0.3, {
				x: 0,
				ease: Cubic.easeOut 
			})
			if (map) {
				TweenMax.to([map], 0.3, {
					x: 0,
					ease: Cubic.easeOut 
				})
			}
			if (overlay) {
				overlay.classList.remove('active');
			}
		}
	}

	var _handleMutate = function() {
		main = document.getElementsByTagName('main')[0];
		menu = document.getElementsByClassName('mobile-menu')[0];
		footer = document.getElementsByTagName('footer')[0];
		map  = document.getElementsByClassName('map-section')[0];
		overlay = document.getElementsByClassName('mobile-menu-overlay')[0];
		body = document.getElementsByTagName('body')[0];

		if (!main || !footer || !menu) {
			console.warn('menu structure corrupted');
			return;
		}
	}

	var _handleBPChange = function() {
		if (status === 'inactive') return;
		if (bpStore.getData().breakpoint.name === 'desktop') {
			dispatcher.dispatch({
				type: 'mobile-menu-deactivate'
			});
		}
	}

	var init = function() {
		_handleMutate();
		_handleChange();

		store.eventEmitter.subscribe(_handleChange);
		bpStore.eventEmitter.subscribe(_handleBPChange);

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