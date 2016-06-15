define(['dispatcher'], function(dispatcher) {

	"use strict";

	var initialized = false;
	var items = {}
	var totalPrice = 0;
	var totalNumber = 0;

	var _handleEvent = function(e) {
		var recountTotal = function() {
			totalNumber = 0;
			totalPrice  = 0;
			for (var id in items) {
				if (items.hasOwnProperty(id)) {
					totalNumber += items[id].number;
					totalPrice  += items[id].totalPrice;
				}
			}
		}

		if (e.type === 'cart-set') {
			items = e.items;
			totalPrice = e.totalPrice;
			totalNumber = e.totalNumber;

			eventEmitter.dispatch();
		}

		if (e.type === 'cart-add') {
			if (items.hasOwnProperty(e.id)) {
				items[e.id].number += parseFloat(e.number);
				items[e.id].totalPrice = items[e.id].number*items[e.id].price;

				if (items[e.id].number <= 0) {
					delete items[e.id];
				}
			} else {
				if (e.number <= 0) return;
				items[e.id] = {
					number: parseFloat(e.number),
					price:  parseFloat(e.price),
					totalPrice: parseFloat(e.number)*parseFloat(e.price)
				}
			}

			recountTotal();
			eventEmitter.dispatch();
		}

		if (e.type === 'cart-remove') {
			if (!items.hasOwnProperty(e.id)) return;

			items[e.id].number -= parseFloat(e.number);

			if (items[e.id].number <= 0) {
				delete items[e.id];
			}

			recountTotal();
			eventEmitter.dispatch();
		}

		if (e.type === 'cart-remove-all') {
			if (!items.hasOwnProperty(e.id)) return;

			delete items[e.id];

			recountTotal();
			eventEmitter.dispatch();
		}

		if (e.type === 'cart-set-number') {
			if (items.hasOwnProperty(e.id)) {
				items[e.id].number = parseFloat(e.number);
				items[e.id].totalPrice = items[e.id].number*items[e.id].price;

				if (items[e.id].number <= 0) {
					delete items[e.id];
				}
			} else {
				if (e.number <= 0) return;
				items[e.id] = {
					number: parseFloat(e.number),
					price: 0,
					totalPrice: 0
				}
			}

			recountTotal();
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
			items: items,
			totalPrice: totalPrice,
			totalNumber: totalNumber
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