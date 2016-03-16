define(['dispatcher'], function(dispatcher) {

	"use strict";

	var container;
	var apiLoaded = false;
	var lang;

	var _build = function(container) {
		var lat, lng, zoom;
		var id;
		var config, styles;
		var map;

		id   = container.id;
		lat  = container.getAttribute('data-lat')  || 0;
		lng  = container.getAttribute('data-lng')  || 0;
		zoom = parseInt(container.getAttribute('data-zoom')) || 2;

		styles = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"lightness":20},{"color":"#ececec"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"on"},{"color":"#f0f0ef"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#f0f0ef"}]},{"featureType":"landscape.man_made","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#d4d4d4"}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"on"},{"color":"#ececec"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"lightness":21},{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#d4d4d4"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#303030"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"saturation":"-100"}]},{"featureType":"poi.attraction","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.government","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"featureType":"poi.place_of_worship","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.school","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.school","elementType":"geometry.stroke","stylers":[{"lightness":"-61"},{"gamma":"0.00"},{"visibility":"off"}]},{"featureType":"poi.sports_complex","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#dadada"},{"lightness":17}]}];
		config = {
			zoom: zoom,
			scrollwheel: false,
			center: new google.maps.LatLng(lat, lng)
		}

		map = new google.maps.Map(container, config);

		map.setOptions({styles: styles});

		container.style.background = '#f2f2f2';

		dispatcher.dispatch({
			type: 'map-initialized',
			map: map
		});
	}

	var _add = function(element) {
		var id = element.getAttribute('data-id');

		if (!id) {
			id = idName + idNum;
			idNum++;
			// element.setAttribute('data-id', id);
		}
	}

	var _handleMutate = function() {
		var html = document.getElementsByTagName('html')[0];
		var loadMaps = function() {
			var script;

			if (apiLoaded) {
				_build(container);
				return;
			}

			apiLoaded = true;

			script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = 'https://www.google.com/jsapi?key=AIzaSyCIuYnYUScrpSJwCMtCUKM-9yVn8wT_QoM&callback=initLoader';
			script.setAttribute('async', '');
			document.body.appendChild(script);
		}

		lang = html.getAttribute('lang');

		if (!lang) lang = 'ru';

		container = document.getElementsByClassName('map-view')[0];
		if (!container) return;

		loadMaps();
	}

	var _initMaps = function() {
		_build(container);
	}

	var init = function() {
		_handleMutate();

		dispatcher.subscribe(function(e) {
			if (e.type === 'mutate') {
				_handleMutate();
			}
		});
	}

	window.initLoader = function() {
		google.load("maps", "3.x", {"callback" : _initMaps, "other_params": "language=" + lang});
	}

	return {
		init: init
	}
});