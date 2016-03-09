define(['dispatcher', 'menu/mobile-menu.store'], function(dispatcher, store) {

	"use strict";
	var active = false;
	var btn;

	var _handleChange = function() {
		var storeData = store.getData();

		if (active === false && storeData.status === 'active') {
			active = true;
			btn.classList.add('active');
		}
		if (active === true && storeData.status === 'inactive') {
			active = false;
			btn.classList.remove('active');
		}
	}

	var _handleMutate = function() {
		var overlay = document.getElementsByClassName('mobile-menu-overlay')[0];
		btn = document.getElementsByClassName('mobile-menu-toggle')[0];

		if (!btn) {
			console.warn('mobile-menu-toggle button is missing');
			return;
		}

		overlay.addEventListener('click', function(e) {
			dispatcher.dispatch({
				type: 'mobile-menu-deactivate'
			});
		});

		btn.addEventListener('click', function(e) {
			if (active) {
				dispatcher.dispatch({
					type: 'mobile-menu-deactivate'
				});
			} else {
				dispatcher.dispatch({
					type: 'mobile-menu-activate'
				});
			}
		});
	}

	var init = function() {
		_handleMutate();
		_handleChange();

		store.eventEmitter.subscribe(_handleChange);

		dispatcher.subscribe(function(e) {
			if (e.type === 'mutate') {
				_handleMutate();
				_handleChange();
			}
		});
	}

	return {
		init: init
	}
});