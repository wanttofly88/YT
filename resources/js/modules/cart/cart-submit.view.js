define(['dispatcher', 'cart/cart.store', 'utils'], function(dispatcher, store, utils) {

	"use strict";

	var items = {}

	//!!!replace if setting data-attribute!
	var idName = 'new-id-';
	var idNum  = 1;
	var initial = true;


	var _handleChange = function() {
		var storeData = store.getData();

		var checkItem = function(item) {
			var storeItem;

			if (storeData.totalPrice <= 0) {
				item.element.classList.add('inactive');
			} else {
				item.element.classList.remove('inactive');
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
		var action = element.getAttribute('data-action');

		if (!id) {
			id = idName + idNum;
			idNum++;

			//setAttribute('data-id', id);
		}

		if (!action) {
			console.warn('data-action is not defined');
			return;
		}

		element.addEventListener('click', function(e) {
			var storeData = store.getData();
			var data = {};
			e.preventDefault();

			if (storeData.totalPrice <= 0) return;

			data['ajax'] = true;

			data = JSON.stringify(data);

			utils.ajax.post(action, data, function(responce) {
				var json;
				dispatcher.dispatch({
					type: 'cart-responded',
					responce: responce
				});

				json = JSON.parse(responce);
				if (json.status === 'success') {
					element.parentNode.classList.add('submitted');
				}
				
			}, true, 'json');

			dispatcher.dispatch({
				type: 'cart-submit'
			});
		});


		items[id] = {
			id: id,
			action: action,
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
		elements = document.getElementsByClassName('view-cart-submit');
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