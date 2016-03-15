define(['dispatcher', 'slider/slider.store'], function(dispatcher, store) {

	"use strict";

	var items = {}

	var idName = 'slider-counter-id-';
	var idNum  = 1;


	var _handleChange = function() {
		var storeData = store.getData();

		var checkItem = function(item) {
			var itemData;
			var tmpVal;
			var itemDataIndex;
			var itemDataTotal;

			if (!storeData.items.hasOwnProperty(item.id)) return;

			itemData = storeData.items[item.id];

			itemDataIndex = itemData.index + 1;
			itemDataTotal = itemData.total + 1;

			if (item.index !== itemDataIndex) {
				item.index = itemDataIndex;
				if (item.leadZero && item.index < 10) {
					tmpVal = '0' + (item.index + 1);
				} else {
					tmpVal = item.index;
				}

				item.curElement.innerHTML = tmpVal;
			}

			if (item.total !== itemDataTotal) {
				item.total = itemDataTotal;
				if (item.leadZero && item.total < 10) {
					tmpVal = '0' + (item.total + 1);
				} else {
					tmpVal = item.total;
				}

				item.totElement.innerHTML = tmpVal;
			}
		}

		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				checkItem(items[id]);
			}
		}
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');

		var curElement = element.querySelector('.cur');
		var totElement = element.querySelector('.tot');
		var leadZero   = element.getAttribute('data-lead-zero');

		if (!id) {
			id = idName + idNum;
			idNum++;

			//setAttribute('data-id', id);
		}

		if (!leadZero) {
			leadZero = false;
		} else if (leadZero === 'true') {
			leadZero = true;
		}


		items[id] = {
			id: id,
			curElement: curElement,
			totElement: totElement,
			leadZero: leadZero,
			element: element,
			index: false,
			total: false
		}
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
		elements = document.getElementsByClassName('view-slider-counter');
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