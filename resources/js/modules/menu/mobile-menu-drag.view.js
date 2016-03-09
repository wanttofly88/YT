define(['dispatcher', 'TweenMax'], function(dispatcher, TweenMax) {

	"use strict";
	var timeStart;
	var startX;
	var startY;
	var started = false;
	var delta;

	var _handleMutate = function() {
		var menu = document.getElementsByClassName('mobile-menu')[0];
		var body = document.getElementsByTagName('body')[0];
		if (!menu) return;

		menu.addEventListener('dragstart', function(e) {
			e.preventDefault();
		});

		menu.addEventListener('touchstart', function(e) {

			if (e.touches.length > 1) return;

			timeStart =  +new Date;
			startX = e.touches[0].pageX;
			startY = e.touches[0].pageY;

			delta = 0;

			started = true;

			dispatcher.dispatch({
				type: 'mobile-menu-drag'
			});


		});
		menu.addEventListener('touchmove', function(e) {
			var x, y;

			if (e.touches.length > 1) return;
			if (!started) return;

			x = e.touches[0].pageX;
			y = e.touches[0].pageY;

			delta = startX - x;
			if (delta < 0) return;

			TweenMax.to(menu, 0, {
				x: -delta
			});
		});
		menu.addEventListener('touchend', function(e) {
			var duration;

			if (e.touches.length > 1) return;

			if (!started) return;

			if (Math.abs(y - startY) >= Math.abs(x - startX)) return;

			duration = +new Date - timeStart;

			if ((duration < 250 && delta > 20) || delta > 100) {
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