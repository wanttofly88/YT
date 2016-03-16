define(['dispatcher', 'resize/resize.store', 'resize/breakpoint.store'], function(dispatcher, store, bpStore) {

	"use strict";

	var main;
	var footer;
	var header;
	var contacts = false;

	var _handleChange = function() {
		var storeData = store.getData();
		var bpData = bpStore.getData();
		var shift = 0;
		if (contacts) shift = 200;

		if (bpData.breakpoint.name === 'desktop') {
			main.style.minHeight = (storeData.height - footer.clientHeight - shift) + 'px';
		} else {
			main.style.minHeight = (storeData.height - footer.clientHeight - header.clientHeight - shift) + 'px';
		}

	}

	var _handleMutate = function() {
		main   = document.getElementsByTagName('main')[0];
		footer = document.getElementsByTagName('footer')[0];
		header = document.getElementsByTagName('header')[0];
		contacts = document.getElementsByClassName('contacts-page')[0];
		if (!main || !footer || !header) return;
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