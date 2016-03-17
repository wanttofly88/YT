define(['dispatcher', 'slider/slider.store', 'TweenMax'], function(dispatcher, store, TweenMax) {

	"use strict";

	var items = {}

	var idName = 'masked-slider-id-';
	var idNum  = 1;

	var _translate = function(element, dist, speed) {
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

	var _detectWay = function(item, next) {
		var way;

		if (next < item.index) {
			if (item.continuous) {
				if ((item.index - next) <= (item.total - (item.index - next))) {
					way = 'prev';
				} else {
					way = 'next';
				}
			} else {
				way = 'prev';
			}
		} else {
			if (item.continuous) {
				if ((next - item.index) <= (item.total - (next - item.index))) {
					way = 'next';
				} else {
					way = 'prev';
				}
			} else {
				way = 'next';
			}
		}
		return way;
	}

	var _handleChange = function() {
		var storeData = store.getData();

		var checkItem = function(item) {
			var itemData;
			var way;
			var prevSlide;

			var showSlide = function(slide, prevSlide) {
				var width = slide.element.clientWidth;

				item.z++;
				slide.element.style.zIndex = item.z;

				if (!slide.element.classList.contains('moving')) {
					if (way === 'next') {
						_translate(slide.imgWrap, width, 0);
						_translate(slide.img, -width/2, 0);
					}
					if (way === 'prev') {
						_translate(slide.imgWrap, -width, 0);
						_translate(slide.img, width/2, 0);
					}
				}

				setTimeout(function() {
					_translate(slide.imgWrap, 0, 700);
					_translate(slide.img, 0, 700);
				}, 20);

				slide.element.classList.remove('moving');
				prevSlide.element.classList.remove('lower-moving');
			}

			if (!storeData || !storeData.items.hasOwnProperty(item.id)) {
				console.warn('error. no data in store for slider with id ' + item.id);
				return;
			}

			itemData = storeData.items[item.id];

			if (item.index === itemData.index) return;

			way = _detectWay(item, itemData.index);

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

	var _handleTouch = function(item) {
		var start = {};
		var delta = {};
		var isScrolling;
		var container = item.element.parentNode;
		var nextIndex = false;
		var width;
		var zSet = false;
		var shift;

		var ontouchstart = function(e) {
			var touches = e.touches[0];

			start = {
				x: touches.pageX,
				y: touches.pageY,
				time: +new Date
			}

			isScrolling = undefined;
			zSet = false;

			delta = {};

			width = item.element.clientWidth;

			container.addEventListener('touchmove', ontouchmove, false);
			container.addEventListener('touchend',  ontouchend, false);
		}
		var ontouchmove = function(e) {
			var touches;
			var tmpNextIndex;
			var move;
			var way;

			if (e.touches.length > 1 || e.scale && e.scale !== 1) return

			touches = event.touches[0];

			delta = {
				x: touches.pageX - start.x,
				y: touches.pageY - start.y
			}

			if (typeof isScrolling === 'undefined') {
				isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
			}

			if (isScrolling) return;

			if (delta.x < 0) {
				tmpNextIndex = item.index + 1;
				if (tmpNextIndex > item.total) tmpNextIndex = 0;
			} else {
				tmpNextIndex = item.index - 1;
				if (tmpNextIndex < 0) tmpNextIndex = item.total;
			}

			if (nextIndex !== false && tmpNextIndex !== nextIndex) {
				item.slides[nextIndex].element.style.zIndex = item.z - 2;
				item.slides[nextIndex].element.classList.remove('moving');
				item.slides[item.index].element.classList.remove('lower-moving');
				zSet = false;
			}
			nextIndex = tmpNextIndex;

			if (!zSet) {
				zSet = true;
				item.slides[item.index].element.classList.add('lower-moving');
				item.slides[nextIndex].element.classList.add('moving');
				item.slides[nextIndex].element.style.zIndex = item.z + 1;
			}

			way = _detectWay(item, nextIndex);
			if (way === 'prev') {
				shift = -width;
			} 
			if (way === 'next') {
				shift = +width;
			}

			move = delta.x/3;
			if (move > width/3) {
				move = width/3;
			}
			if (move < -width/3) {
				move = -width/3;
			}

			if (!isScrolling) {
				e.preventDefault();
				_translate(item.slides[nextIndex].imgWrap, move + shift, 0);
				_translate(item.slides[nextIndex].img, -(shift+move)/2, 0);
			}

		}
		var ontouchend = function(e) {
			var duration = +new Date - start.time;
			var check = parseInt(duration) < 250 && Math.abs(delta.x) > 20 || Math.abs(delta.x) > width/3.5;

			if (isScrolling || nextIndex === false) return;

			if (check) {
				dispatcher.dispatch({
					type: 'slider-change-to',
					id: item.id,
					index: nextIndex
				});
			} else {
				_translate(item.slides[nextIndex].imgWrap, shift, 300);
				_translate(item.slides[nextIndex].img, -shift/2, 300);
				item.slides[nextIndex].element.classList.remove('moving');
				item.slides[item.index].element.classList.remove('lower-moving');
				zSet = false;
			}
		}

		container.addEventListener('touchstart', ontouchstart);
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');
		var speed = element.getAttribute('data-speed');
		var continuous = element.getAttribute('data-continuous');
		var total;
		var index = 0;
		var slidesElements;
		var z = 1;
		var slides = [];

		var addSlide = function(slide) {
			var imgWrap = slide.getElementsByClassName('img-wrap')[0];
			var img = slide.getElementsByClassName('img')[0];

			slides.push({
				element: slide,
				imgWrap: imgWrap,
				img: img
			});
		}


		if (!id) {
			id = idName + idNum;
			idNum++;
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

		slidesElements = element.getElementsByClassName('slide');
		slidesElements[index].style.zIndex = z;
		z++;

		total  = slidesElements.length - 1;

		for (var i = 0; i < slidesElements.length; i++) {
			addSlide(slidesElements[i]);
		}

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

		_handleTouch(items[id]);
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