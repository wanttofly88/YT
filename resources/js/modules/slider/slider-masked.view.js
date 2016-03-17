define(['dispatcher', 'slider/slider.store', 'TweenMax'], function(dispatcher, store, TweenMax) {

	"use strict";

	var items = {}

	var idName = 'masked-slider-id-';
	var idNum  = 1;

	var _handleChange = function() {
		var storeData = store.getData();

		var checkItem = function(item) {
			var itemData;
			var way;
			var prevSlide;

			var translate = function(element, dist, speed) {
				element.style.webkitTransitionDuration =
				element.style.MozTransitionDuration =
				element.style.msTransitionDuration =
				element.style.OTransitionDuration =
				element.style.transitionDuration = speed + 'ms';

				element.style.webkitTransform = 'translateX(' + dist + 'px) translateZ(0)';
				element.style.msTransform =
				element.style.MozTransform =
				element.style.OTransform = 'translateX(' + dist + 'px)';
			}

			var showSlide = function(slide, prevSlide) {
				var container = slide.getElementsByClassName('img-wrap')[0];
				var img = slide.getElementsByClassName('img')[0];
				var width = slide.clientWidth;

				item.z++;
				slide.style.zIndex = item.z;

				if (!container || !img) return;

				if (way === 'next') {
					translate(container, width, 0);
					translate(img, -width/2, 0);
				}
				if (way === 'prev') {
					translate(container, -width, 0);
					translate(img, width/2, 0);
				}

				setTimeout(function() {
					translate(container, 0, 700);
					translate(img, 0, 700);
				}, 20);


				// if (way === 'next') {
				// 	TweenMax.to(container, 0, {
				// 		x: width
				// 	});
				// 	TweenMax.to(img, 0, {
				// 		x: -width/2
				// 	});
				// }
				// if (way === 'prev') {
				// 	TweenMax.to(container, 0, {
				// 		x: -width
				// 	});
				// 	TweenMax.to(img, 0, {
				// 		x: width/2
				// 	});
				// }

				// TweenMax.to(container, 0.7, {
				// 	x: 0,
				// 	ease: Sine.easeInOut
				// });
				// TweenMax.to(img, 0.7, {
				// 	x: 0,
				// 	ease: Sine.easeInOut
				// });
			}

			if (!storeData || !storeData.items.hasOwnProperty(item.id)) {
				console.warn('error. no data in store for slider with id ' + item.id);
				return;
			}

			itemData = storeData.items[item.id];

			if (item.index === itemData.index) return;

			if (itemData.index < item.index) {
				if (item.continuous) {
					if ((item.index - itemData.index) <= (item.total - (item.index - itemData.index))) {
						way = 'prev';
					} else {
						way = 'next';
					}
				} else {
					way = 'prev';
				}
			} else {
				if (item.continuous) {
					if ((itemData.index - item.index) <= (item.total - (itemData.index - item.index))) {
						way = 'next';
					} else {
						way = 'prev';
					}
				} else {
					way = 'next';
				}
			}

			prevSlide = item.slides[item.index];
			item.index = itemData.index;
			showSlide(item.slides[item.index], prevSlide);
		}

		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				checkItem(items[id]);
			}
		}
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');
		var speed = element.getAttribute('data-speed');
		var continuous = element.getAttribute('data-continuous');
		var total;
		var index = 0;
		var slides;
		var z = 1;

		if (!id) {
			id = idName + idNum;
			idNum++;

			//setAttribute('data-id', id);
		}

		if (continuous && continuous === 'true') {
			continuous = true;
		} else {
			continuous = false;
		}

		if (!speed) {
			speed = 600;
		} else {
			speed = parseInt(speed);
		}

		slides = element.getElementsByClassName('slide');
		slides[index].style.zIndex = z;
		z++;

		total  = slides.length - 1;

		element.classList.add('initialized');

		dispatcher.dispatch({
			type: 'slider-add',
			id: id,
			continuous: continuous,
			total: total,
			index: index,
			speed: speed
		});

		items[id] = {
			id: id,
			element: element,
			slides: slides,
			continuous: continuous,
			index: index,
			speed: speed,
			total: total,
			z: z
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
		elements = document.getElementsByClassName('masked-slider');
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