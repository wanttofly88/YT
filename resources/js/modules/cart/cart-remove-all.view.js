define(['dispatcher', 'cart/cart.store', 'utils'], function(dispatcher, store, utils) {

	"use strict";

	var items = {}

	//!!!replace if setting data-attribute!
	var idName = 'cart-remove-all-id-';
	var idNum  = 1;
	var initialized = false;


	var _handleChange = function() {

	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');
		var action = element.getAttribute('data-action');

		if (!action) {
			console.warn('data-action is not defined');
			return;
		}

		if (!id) {
			id = idName + idNum;
			idNum++;

			//setAttribute('data-id', id);
		}

		element.addEventListener('click', function(e) {
			var data = {};
			var storeData;
			data['id'] = id;
			data['ajax'] = true;
			data['number'] = 0;

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
				number: 0
			});

			storeData = store.getData();
			if (storeData.totalNumber <= 0 && initialized) {
				setTimeout(function() {
					location.href = '/';
				}, 600);
			}
		});

		initialized = true;

		items[id] = {
			id: id,
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
		elements = document.getElementsByClassName('view-cart-remove-all');
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
			}
		});
	}

	return {
		init: init
	}
});