define(['dispatcher', 'cart/cart.store', 'utils'], function(dispatcher, store, utils) {

	"use strict";

	var _handleChange = function() {

	}

	var _cartGet = function() {
		utils.ajax.post('/content/cart_get_json/', {
			ajax: true
		}, function(responce) {
			_handleResponce(responce);
		}, true, 'json');
	}

	var _handleResponce = function(responce) {
		var responce = JSON.parse(responce);
		var items = {}

		for (var i = responce.items.length - 1; i >= 0; i--) {
			items[responce.items[i].id] = {
				id: responce.items[i].id,
				price: parseFloat(responce.items[i].price),
				totalPrice: parseFloat(responce.items[i].totalPrice),
				number: parseFloat(responce.items[i].number)
			}
		}

		dispatcher.dispatch({
			type: 'cart-set',
			items: items,
			totalNumber: responce.totalNumber,
			totalPrice: responce.totalPrice
		});
	}

	var _handleMutate = function() {
		_cartGet();
	}

	var init = function() {
		_handleMutate();

		store.eventEmitter.subscribe(_handleChange);

		dispatcher.subscribe(function(e) {
			if (e.type === 'mutate') {
				_handleMutate();
				_handleChange();
			}
		});
		dispatcher.subscribe(function(e) {
			if (e.type === 'cart-verification-needed') {
				_cartGet();
			}
		});
		dispatcher.subscribe(function(e) {
			if (e.type === 'cart-responded') {
				_handleResponce(e.responce);
			}
		});
	}

	return {
		init: init
	}
});