define(['dispatcher', 'drop-down/drop-down.store', 'resize/resize.store', 'resize/breakpoint.store'], function(dispatcher, store, resizeStore, bpStore) {

	"use strict";

	var items = {}

	var idName = 'drop-down-id-';
	var breakpointName = 'desktop';
	var animationDelay = 300;
	var to;
	var idNum  = 1;


	var _handleChange = function() {
		var storeData = store.getData();

		var checkItem = function(item) {
			var container = item.element;
			var id = item.id;

			if (item.active === storeData.items[id].active) return;

			item.active = storeData.items[id].active

			if (!item.active) {
				_hide(item);
			}

			if (item.active) {
				_show(item);
			}
		}

		for (var id in items) {
			checkItem(items[id]);
		}
	}

	var _show = function(item) {
		item.element.classList.add('active');
		item.element.style.height = (item.inner.clientHeight) + 'px';

		clearTimeout(to);
		to = setTimeout(function() {
			item.element.style.height = 'auto';
		}, animationDelay);
	}

	var _hide = function(item) {
		var bpName = bpStore.getData().breakpoint.name;
		var h;

		if (item.element.clientHeight === 0) return;

		h = item.heights[bpName] || 0;
		if (item.inner.clientHeight <= h) h = item.inner.clientHeight;

		item.element.classList.remove('active');
		item.element.style.height = (item.inner.clientHeight) + 'px';

		setTimeout(function() {
			item.element.style.height = h + 'px';
		}, 20);
	}

	var _recount = function() {
		var bpName = breakpointName || bpStore.getData().breakpoint.name;

		var _check = function(item) {
			var h =  item.heights[bpName] || 0;
			var ih = item.inner.clientHeight;

			if (ih <= h && item.enabled) {
				item.enabled = false;
				dispatcher.dispatch({
					type: 'drop-down-disable',
					me:   'drop-down-view',
					id: item.id
				});
				dispatcher.dispatch({
					type: 'drop-down-activate',
					me:   'drop-down-view',
					id: item.id
				});
				item.element.style.height = 'auto';
			} else if (ih > h & !item.enabled) {
				item.enabled = true;
				dispatcher.dispatch({
					type: 'drop-down-enable',
					me:   'drop-down-view',
					id: item.id
				});
			}

			if (item.enabled) {
				if (item.active) {
					_show(item);
					//item.element.style.height = (item.inner.clientHeight) + 'px';
				} else {
					_hide(item);
					//item.element.style.height = item.heights[bpName] + 'px';
				}
			}

		}

		for (var id in items) {
			_check(items[id]);
		}
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');
		var inner = element.getElementsByClassName('drop-down-inner')[0];
		var heights = {}
		var active = element.classList.contains('active');

		if (!id) {
			id = idName + idNum;
			idNum++;

			//setAttribute('data-id', id);
		}

		heights.mobile  = element.getAttribute('data-height-mobile')  || 9999999;
		heights.mobile  = parseInt(heights.mobile);

		heights.tablet  = element.getAttribute('data-height-tablet')  || 9999999;
		heights.tablet  = parseInt(heights.tablet);

		heights.desktop = element.getAttribute('data-height-desktop') || 9999999;
		heights.desktop = parseInt(heights.desktop);

		items[id] = {
			id: id,
			enabled: true,
			active: active,
			element: element,
			inner: inner,
			heights: heights
		}

		dispatcher.dispatch({
			type: 'drop-down-add',
			id: id,
			active: active
		});
	}

	var _remove = function(items, item) {
		dispatcher.dispatch({
			type: 'drop-down-remove',
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
		elements = document.getElementsByClassName('drop-down-container');
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
		setTimeout(_recount, 0);
		resizeStore.eventEmitter.subscribe(function() {
			setTimeout(_recount, 0);
		});

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