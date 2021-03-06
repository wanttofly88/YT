define(['dispatcher', 'cart/cart.store', 'utils'], function(dispatcher, store, utils) {

	"use strict";

	var items = {}

	var idName = 'cart-number-id-';
	var idNum  = 1;


	var _handleChange = function() {
		var storeData = store.getData();

		var checkItem = function(item) {
			var storeItem;

			if (!storeData.items.hasOwnProperty(item.id)) return;

			storeItem = storeData.items[item.id];

			if (item.element.value !== storeItem.number) {
				item.element.value = storeItem.number;
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
		var min, max;

		var action = element.getAttribute('data-action');

		if (!action) {
			console.warn('data-action is not defined');
			return;
		}

		if (element.tagName.toLowerCase() !== 'input') return;

		min = element.getAttribute('min') || 0;
		max = element.getAttribute('max') || 99999;
		min = parseInt(min);
		max = parseInt(max);

		if (!id) {
			id = idName + idNum;
			idNum++;

			//setAttribute('data-id', id);
		}

		element.addEventListener('change', function(e) {
			var num;
			var data = {};

			if (element.value < min) {
				element.value = min;
			}
			if (element.value > max) {
				element.value = max;
			}
			if (element.value === '') {
				element.value = 1;
			}

			num = parseFloat(element.value);

			data['id'] = id;
			data['ajax'] = true;
			data['number'] = num;

			data = JSON.stringify(data);

			utils.ajax.post(action, data, function(responce) {
				dispatcher.dispatch({
					type: 'cart-responded',
					responce: responce
				});
			}, true, 'json');

			dispatcher.dispatch({
				type: 'cart-set-number',
				id: id,
				number: parseFloat(num)
			})
		});

		items[id] = {
			id: id,
			min: min,
			max: max,
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
		elements = document.getElementsByClassName('view-cart-number');
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