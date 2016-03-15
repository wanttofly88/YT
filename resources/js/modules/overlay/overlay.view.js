define(['dispatcher', 'overlay/overlay.store'], function(dispatcher, store) {

	"use strict";

	var overlay;

	var _handleChange = function() {
		var storeData = store.getData();
		if (storeData.active) {
			if (overlay) {
				overlay.classList.add('active');
			}
		} else {
			if (overlay) {
				overlay.classList.remove('active');
			}
		}
	}

	var _handleMutate = function() {
		overlay = document.getElementById('total-overlay');
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