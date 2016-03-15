define(['dispatcher', 'selects/selects.store'], function(dispatcher, store) {

	"use strict";

	var items = {}

	var idName = 'select-id-';
	var idNum  = 1;


	var _handleChange = function() {
		var storeData = store.getData();
		var checkItem = function(item) {
			var storeItem;
			if (!storeData.items.hasOwnProperty(item.id)) return;
			storeItem = storeData.items[item.id];

			if (storeItem.value === item.element.value) return;
			item.element.value = storeItem.value;
		}

		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				checkItem(items[id]);
			}
		}
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');
		var value = element.value;

		if (!id) {
			id = idName + idNum;
			idNum++;
		}

		element.addEventListener('change', function(e) {
			dispatcher.dispatch({
				type: 'select-change',
				id: id,
				value: element.value
			});
		});

		items[id] = {
			id: id,
			element: element
		}

		dispatcher.dispatch({
			type: 'select-add',
			id: id,
			value: value
		});
	}

	var _remove = function(items, item) {
		dispatcher.dispatch({
			type: 'select-remove',
			id: item.id
		});

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
		elements = document.getElementsByClassName('view-select');
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