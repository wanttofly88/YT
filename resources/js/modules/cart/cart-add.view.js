define(['dispatcher', 'cart/cart.store'], function(dispatcher, store) {

	"use strict";

	var items = {}
	var inputItems = {}

	var idName = 'vart-add-id-';
	var idNum  = 1;


	var _handleChange = function() {
		var storeData = store.getData();

		var checkItem = function(item) {
			var storeItem;

			if (storeData.items.hasOwnProperty(item.id) && !item.active) {

				item.element.parentNode.classList.add('added');
				item.active = true;
			}
			if (!storeData.items.hasOwnProperty(item.id) && item.active) {
				item.element.parentNode.classList.remove('added');
				item.active = false;
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

		var handleClick = function(item) {
			var num;

			if (inputItems.hasOwnProperty(id)) {
				num = inputItems[id].element.value;
				if (num < 0) num = 0;
			} else {
				num = 1;
			}

			dispatcher.dispatch({
				type: 'cart-add',
				id: id,
				number: num,
				price: 0
			});
		}

		if (element.classList.contains('cart-add')) {
			element.addEventListener('click', handleClick);
		}

		if (!id) {
			id = idName + idNum;
			idNum++;
		}

		items[id] = {
			id: id,
			element: element,
			active: false
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
		elements = document.getElementsByClassName('cart-add');
		for (var i = 0; i < elements.length; i++) {
			check(items, elements[i]);
		}
		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				backCheck(items, elements, items[id]);
			}
		}

		elements = document.getElementsByClassName('cart-add-number');
		for (var i = 0; i < elements.length; i++) {
			check(inputItems, elements[i]);
		}
		for (var id in inputItems) {
			if (inputItems.hasOwnProperty(id)) {
				backCheck(inputItems, elements, inputItems[id]);
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