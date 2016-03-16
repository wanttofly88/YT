define(['dispatcher', 'drop-down/drop-down.store'], function(dispatcher, store) {

	"use strict";

	var items = {}

	//!!!replace if setting data-attribute!
	var idName = 'drop-down-control-id-';
	var idNum  = 1;


	var _handleChange = function() {
		var storeData = store.getData();

		var _checkItem = function(item) {
			var id = item.id;

			if (!storeData.items.hasOwnProperty(id)) return;
			item.active = storeData.items[id].active;

			if (item.active) {
				item.element.classList.add('active');
			} else {
				item.element.classList.remove('active');
			}

			if (storeData.items[id].disabled) {
				item.element.classList.add('hidden');
			} else {
				item.element.classList.remove('hidden');
			}
		}

		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				_checkItem(items[id]);
			}
		}
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');
		var active = element.classList.contains('active');

		if (!id) {
			id = idName + idNum;
			idNum++;

			//setAttribute('data-id', id);
		}

		element.addEventListener('click', function() {
			dispatcher.dispatch({
				type: 'drop-down-toggle',
				me:   'drop-down-controls',
				id:   id
			});
		});


		items[id] = {
			id: id,
			element: element,
			active: active
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
		elements = document.getElementsByClassName('drop-down-control');
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