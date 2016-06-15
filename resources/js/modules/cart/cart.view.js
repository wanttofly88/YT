define(['dispatcher', 'cart/cart.store'], function(dispatcher, store) {

	"use strict";

	var items = {}

	var idName = 'cart-id-';
	var idNum  = 1;

	var _handleChange = function() {
		var storeData = store.getData();

		var removeItem = function(item) {
			item.element.classList.add('removing');
			setTimeout(function() {
				item.element.style.display = 'none';
				delete items[item.id];
			}, 400);
		}

		var addItem = function() {
			//not supported
			location.reload();
		}

		var checkItem = function(item) {
			var storeItem;

			if (!storeData.items.hasOwnProperty(item.id)) {
				removeItem(item);
				return;
			}
			storeItem = storeData.items[item.id];

			if (item.price !== storeItem.price) {
				item.price = storeItem.price;
				if (item.priceElement.tagName.toLowerCase() === 'input') {
					item.priceElement.value = item.price;
				} else {
					item.priceElement.innerHTML = _parsePrice(item.price);
				}
			}
			if (item.number !== storeItem.number) {
				item.number = storeItem.number;
				if (item.numberElement.tagName.toLowerCase() === 'input') {
					item.numberElement.value = item.number;
				} else {
					item.numberElement.innerHTML = _parsePrice(item.number);
				}
			}
			if (item.totalPrice !== storeItem.totalPrice) {
				item.totalPrice = storeItem.totalPrice;
				item.totalPriceElement.innerHTML = _parsePrice(item.totalPrice);
			}
		}

		// var backCheckItem = function(storeItem) {
		// 	if (!items.hasOwnProperty(storeItem.id)) {
		// 		addItem(item);
		// 	}
		// }

		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				checkItem(items[id]);
			}
		}

		// for (var id in storeData.items) {
		// 	if (storeData.items.hasOwnProperty(id)) {
		// 		backCheckItem(storeData.items[id]);
		// 	}
		// }
	}

	var _parsePrice = function(num) {
		var str = num.toString().split(',');
		if (str[0].length >= 3) {
			str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
		}
		// if (str[1] && str[1].length >= 3) {
		// 	str[1] = str[1].replace(/(\d{3})/g, '$1 ');
		// }
		return str.join(',');
	}

	var _getFloat = function(string) {
		var trimmed = string.replace(/\s+/g, '');
		return parseFloat(trimmed);
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');
		var price, number, totalPrice;
		var numberElement = element.getElementsByClassName('view-cart-number')[0];
		var priceElement  = element.getElementsByClassName('view-cart-price')[0];
		var totalPriceElement = element.getElementsByClassName('view-cart-item-total')[0];

		if (!numberElement) {
			number = 0;
		} else {
			if (numberElement.tagName.toLowerCase() === 'input') {
				number = _getFloat(numberElement.value);
			} else {
				number = _getFloat(numberElement.innerHTML);
			}
		}
		if (!priceElement) {
			price = 0;
		} else {
			if (priceElement.tagName.toLowerCase() === 'input') {
				price = _getFloat(priceElement.value);
			} else {
				price = _getFloat(priceElement.innerHTML);
			}
		}
		if (!priceElement) {
			totalPrice = 0;
		} else {
			totalPrice = _getFloat(totalPriceElement.innerHTML);
		}



		if (!id) {
			id = idName + idNum;
			idNum++;
		}

		// dispatcher.dispatch({
		// 	type: 'cart-add',
		// 	id: id,
		// 	number: number,
		// 	price: price
		// });

		items[id] = {
			id: id,
			element: element,
			number: number,
			price: price,
			numberElement: numberElement,
			priceElement: priceElement,
			totalPriceElement: totalPriceElement
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
		elements = document.getElementsByClassName('view-cart-item');
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
		// _handleChange();

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