define(['dispatcher', 'resize/resize.store'], function(dispatcher, store) {

	"use strict";

	var main;
	var footer;

	var _handleChange = function() {
		var storeData = store.getData();

		if (storeData.width >= 1000) {
			main.style.minHeight = (storeData.height - footer.clientHeight - 80) + 'px';
		} else {
			main.style.minHeight = (storeData.height - footer.clientHeight) + 'px';
		}
	}


	var _handleMutate = function() {
		main   = document.getElementsByTagName('main')[0];
		footer = document.getElementsByTagName('footer')[0];
		if (!main || !footer) return;
	}

	var init = function() {
		_handleMutate();
		_handleChange();

		store.eventEmitter.subscribe(_handleChange);

	}

	return {
		init: init
	}
});