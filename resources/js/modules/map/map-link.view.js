define(['dispatcher'], function(dispatcher) {

	"use strict";

	var userAgent;
	var operatingSystem;


	var _add = function(element) {
		if (operatingSystem.toLowerCase() === 'android') {
			element.setAttribute('href', 'https://maps.google.com/?q=51.665753,39.198855');
		} else if (operatingSystem.toLowerCase() === 'ios') {
			element.setAttribute('href', 'https://maps.apple.com/?q=51.665753,39.198855');
		} else {
			element.setAttribute('href', 'https://maps.google.com/?q=51.665753,39.198855');
		}
	}

	var _getMobileOperatingSystem = function() {
		var userAgent = navigator.userAgent || navigator.vendor || window.opera;

		if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
			return 'iOS';
		} else if (userAgent.match(/Android/i)) {
			return 'Android';
		} else {
			return 'unknown';
		}
	}


	var _handleMutate = function() {
		var links = document.getElementsByClassName('map-link');

		// if (operatingSystem === 'unknown') return;

		for (var i = 0; i < links.length; i++) {
			_add(links[i]);
		}
	}

	var init = function() {
		operatingSystem = _getMobileOperatingSystem();

		_handleMutate();

		dispatcher.subscribe(function(e) {
			if (e.type === 'mutate') {
				_handleMutate();
			}
		});
	}

	return {
		init: init
	}
});