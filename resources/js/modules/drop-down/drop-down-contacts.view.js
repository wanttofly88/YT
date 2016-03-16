define(['dispatcher', 'drop-down/drop-down.store'], function(dispatcher, store) {

	"use strict";
	var animationDelay = 300;

	var _catchContacts = function(e) {
		var storeData = store.getData();
		if (e.id === 'dd1') {
			if (storeData.items['dd1'].active) {
				dispatcher.dispatch({
					type: 'drop-down-close',
					id: 'dd2'
				});
			} else {
				setTimeout(function() {
					dispatcher.dispatch({
						type: 'drop-down-close',
						id: 'ddin1'
					});	
				}, animationDelay);
			}
		}

		if (e.id === 'dd2') {
			if (storeData.items['dd2'].active) {
				dispatcher.dispatch({
					type: 'drop-down-close',
					id: 'dd1'
				});
			} else {
				setTimeout(function() {
					dispatcher.dispatch({
						type: 'drop-down-close',
						id: 'ddin2'
					});	
				}, animationDelay);
			}
		}
	}

	var init = function() {
		dispatcher.subscribe(function(e) {
			if (e.type === 'drop-down-toggle') {
				setTimeout(function() {
					_catchContacts(e);
				}, 0);
			}
		});
	}

	return {
		init: init
	}
});