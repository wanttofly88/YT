define(['dispatcher', 'resize/resize.store', 'slider/slider.store'], function(dispatcher, resizeStore, store) {

	"use strict";

	var items = {}

	//!!!replace if setting data-attribute!
	var idName = 'slider-progressbar-id-';
	var idNum  = 1;


	var _handleChange = function() {
		var storeData = store.getData();
	}

	var _handleResize = function() {
		var checkItem = function(item) {
			item.width = item.element.clientWidth;
		}

		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				checkItem(items[id]);
			}
		}
	}


	var _add = function(items, element) {
		var id = element.getAttribute('data-id');
		var activeElement = element.getElementsByClassName('active')[0];
		var delay = element.getAttribute('data-delay') || 3000;
		var time  = 0;
		var width = element.clientWidth;
		var item;

		if (!activeElement) {
			console.warn('active element is missing');
			return;
		}

		if (!id) {
			id = idName + idNum;
			idNum++;

			//setAttribute('data-id', id);
		}

		var _loop = function() {
			if (!item.stopped) {
				item.time += 1000/60;
				if (item.time >= item.delay) {
					item.time = 0;
					dispatcher.dispatch({
						type: 'slider-change-next',
						id: item.id
					});
				}
				item.activeElement.style.width = item.width*(item.time/item.delay) + 'px';
			}
			setTimeout(_loop, 1000/60);
		}

		item = {
			id: id,
			delay: delay,
			time: time,
			width: width,
			stopped: false,
			activeElement: activeElement,
			element: element
		}

		items[id] = item;

		_loop();
	}

	var _remove = function(items, item) {
		delete items[item.id];
	}

	var _handleMutate = function() {
		var elements;

		var check = function(items, element) {
			var found = false;
			for (var id in items) {
				if (items.hasOwnProperty(id)) {
					if (items[id].element === element) {
						found = true;
						break;
					}
				}
			}
			if (!found) {
				_add(items, element);
			}
		}

		var backCheck = function(items, elements, item) {
			var element = item.element;
			var found   = false;

			for (var i = 0; i < elements.length; i++) {
				if (elements[i] === item.element) {
					found = true;
					break;
				}
			}

			if (!found) {
				_remove(items, item);
			}
		}

		//-------
		elements = document.getElementsByClassName('slider-progressbar');
		for (var i = 0; i < elements.length; i++) {
			check(items, elements[i]);
		}
		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				backCheck(items, elements, items[id]);
			}
		}
		//-------
	}

	var init = function() {
		_handleMutate();
		_handleChange();

		store.eventEmitter.subscribe(_handleChange);
		resizeStore.eventEmitter.subscribe(_handleResize);

		dispatcher.subscribe(function(e) {
			if (e.type === 'mutate') {
				_handleMutate();
				_handleChange();
			}
			if (e.type === 'slider-progressbar-stop') {
				if (!items.hasOwnProperty(e.id)) return;
				items[e.id].stopped = true;
			}
			if (e.type === 'slider-progressbar-run') {
				if (!items.hasOwnProperty(e.id)) return;
				items[e.id].stopped = false;
			}
			if (e.type === 'slider-progressbar-reset') {
				if (!items.hasOwnProperty(e.id)) return;
				items[e.id].time = 0;
			}
		});
	}

	return {
		init: init
	}
});