define(['dispatcher'], function(dispatcher) {

	"use strict";

	var initialized = false;
	var status = 'inactive';

	var _handleEvent = function(e) {
		if (e.type === 'mobile-menu-activate') {
			if (status === 'active') return;
			status = 'active';
			eventEmitter.dispatch();
		}
		if (e.type === 'mobile-menu-deactivate') {
			if (status === 'inactive') return;
			status = 'inactive';
			eventEmitter.dispatch();
		}
		if (e.type === 'mobile-menu-drag') {
			if (status === 'drag') return;
			status = 'drag';
			eventEmitter.dispatch();
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
			status: status
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