define(['dispatcher', 'popup/popup.store', 'cart/cart.store'], function(dispatcher, popupStore, cartStore) {

	"use strict";
	var active = false;

	var _handleChange = function() {
		var popupData = popupStore.getData();
		var cartData = cartStore.getData();

		if (active === 'cart-popup') {
			if (popupData.active === false && cartData.totalNumber <= 0) { //закрыли попап корзины
				setTimeout(function() {
					location.href = '/';
				}, 600);
			}
		}

		active = popupData.active;
	}

	var _handleMutate = function() {

	}

	var init = function() {
		_handleMutate();
		_handleChange();

		popupStore.eventEmitter.subscribe(_handleChange);

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