define(['dispatcher', 'TweenMax'], function(dispatcher, TweenMax) {

	"use strict";
	var timeStart;
	var startX;
	var startY;
	var started = false;
	var deltaX;
	var deltaY;

	var _handleMutate = function() {
		var menu = document.getElementsByClassName('mobile-menu')[0];
		var body = document.getElementsByTagName('body')[0];
		if (!menu) return;

		menu.addEventListener('dragstart', function(e) {
			e.preventDefault();
		});

		menu.addEventListener('touchstart', function(e) {
			if (e.touches.length > 1) return;

			e.stopPropagation();

			timeStart =  +new Date;
			startX = e.touches[0].pageX;
			startY = e.touches[0].pageY;

			deltaX = 0;
			deltaY = 0;

			started = true;

			dispatcher.dispatch({
				type: 'mobile-menu-drag'
			});


		});
		menu.addEventListener('touchmove', function(e) {
			var x, y;

			e.stopPropagation();

			if (e.touches.length > 1) return;
			if (!started) return;

			x = e.touches[0].pageX;
			y = e.touches[0].pageY;

			deltaX = startX - x;
			deltaY = startY - y;
			if (deltaX < 0) return;

			TweenMax.to(menu, 0, {
				x: -deltaX
			});
		});
		menu.addEventListener('touchend', function(e) {
			var duration;

			if (e.touches.length > 1) return;

			if (!started) return;

			e.stopPropagation();

			if (Math.abs(deltaY) >= Math.abs(deltaX)) {
				dispatcher.dispatch({
					type: 'mobile-menu-activate'
				});
				return;
			}

			duration = +new Date - timeStart;

			if ((duration < 250 && deltaX > 20) || deltaX > 100) {
				dispatcher.dispatch({
					type: 'mobile-menu-deactivate'
				});
			} else {
				dispatcher.dispatch({
					type: 'mobile-menu-activate'
				});
			}

			started = false;
		});
	}

	var init = function() {
		_handleMutate();
	}

	return {
		init: init
	}
});