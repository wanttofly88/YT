define(['dispatcher'], function(dispatcher) {

	"use strict";

	var initialized = false;
	var items  = {}
	var active = false;

	var _handleEvent = function(e) {
		if (e.type === 'drop-down-add') {
			if (items.hasOwnProperty(e.id)) return;
			items[e.id] = {
				id: e.id,
				active: e.active || false
			}
			if (e.active) {
				active = e.id;
			}
		}

		if (e.type === 'drop-down-remove') {
			if (!items.hasOwnProperty(e.id)) return;
			delete items[e.id];
		}

		if (e.type === 'drop-down-toggle') {
			if (!items.hasOwnProperty(e.id)) return;
			if (items[e.id].disabled) return;
			console.log(active);

			items[e.id].active = !items[e.id].active;

			if (items[e.id].active) {
				if (active) items[active].active = false;
				active = e.id;

			} else {
				if (active) items[active].active = false;
				active = false;
			}

			eventEmitter.dispatch({
				type: 'change'
			});
		}

		if (e.type === 'drop-down-activate') {
			if (!items.hasOwnProperty(e.id)) return;
			if (items[e.id].active === true) return;

			items[e.id].active = true;

			if (active) items[active].active = false;
			active = e.id;

			eventEmitter.dispatch({
				type: 'change'
			});
		}

		if (e.type === 'drop-down-deactivate') {
			if (!items.hasOwnProperty(e.id)) return;
			if (items[e.id].active === false) return;

			items[e.id].active = false;

			if (active) items[active].active = false;
			active = false;

			eventEmitter.dispatch({
				type: 'change'
			});
		}

		if (e.type === 'drop-down-disable') {
			if (!items.hasOwnProperty(e.id)) return;
			if (items[e.id].disabled === true) return;

			items[e.id].disabled = true;

			eventEmitter.dispatch({
				type: 'change'
			});
		}

		if (e.type === 'drop-down-enable') {
			if (!items.hasOwnProperty(e.id)) return;
			if (items[e.id].disabled === false) return;

			items[e.id].disabled = false;

			eventEmitter.dispatch({
				type: 'change'
			});
		}
	}

	var _init = function() {
		dispatcher.subscribe(_handleEvent);
	}

	var eventEmitter = function() {
		var _handlers = [];

		var dispatch = function(event) {
			for (var i = _handlers.length - 1; i >= 0; i--) {
				_handlers[i](event);
			}
		}
		var subscribe = function(handler) {
			_handlers.push(handler);
		}
		var unsubscribe = function(handler) {
			for (var i = 0; i <= _handlers.length - 1; i++) {
				if (_handlers[i] == handler) {
					_handlers.splice(i--, 1);
				}
			}
		}

		return {
			dispatch: dispatch,
			subscribe: subscribe,
			unsubscribe: unsubscribe
		}
	}();

	var getData = function() {
		return {
			items: items
		}
	}

	if (!initialized) {
		initialized = true;
		_init();
	}

	return {
		eventEmitter: eventEmitter,
		getData: getData
	}
});