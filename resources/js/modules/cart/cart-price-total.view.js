define(['dispatcher', 'cart/cart.store'], function(dispatcher, store) {

	"use strict";

	var items = {}

	var idName = 'cart-total-id-';
	var idNum  = 1;


	var _handleChange = function() {
		var storeData = store.getData();

		var storeTotal = storeData.totalPrice;

		var checkItem = function(item) {
			if (item.value !== storeTotal) {
				item.value = storeTotal;
				item.element.innerHTML = _parsePrice(storeTotal);
			}
		}

		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				checkItem(items[id]);
			}
		}
	}

	var _parsePrice = function(num) {
		var str = num.toString().split(',');
		if (str[0].length >= 3) {
			str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
		}
		// if (str[1] && str[1].length >= 3) {
		// 	str[1] = str[1].replace(/(\d{3})/g, '$1 ');
		// }
		return str.join(',');
	}

	var _getFloat = function(string) {
		var trimmed = string.replace(/\s+/g, '');
		return parseFloat(trimmed);
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');
		var value = _getFloat(element.innerHTML);

		if (!id) {
			id = idName + idNum;
			idNum++;

			//setAttribute('data-id', id);
		}

		items[id] = {
			id: id,
			value: value,
			element: element
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
		elements = document.getElementsByClassName('view-cart-total');
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
		// _handleChange();

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