define(['dispatcher', 'map/map.store'], function(dispatcher, store) {

	"use strict";

	var map = false;

	var _handleChange = function() {
		var map = store.getData().map;
		var markers = document.getElementsByClassName('map-marker');

		var add = function(marker, i) {
			var title;
			var lat, lng, latLng;
			var icon, marker;
			var iconPath;
			var markerIcon;

			lat   = marker.getAttribute('data-lat');
			lng   = marker.getAttribute('data-lng');
			title = marker.getAttribute('data-title');

			if (!lat || !lng) {
				console.warn('marker lat or/and lng is missing');
			}

			iconPath = path +  'images/marker.svg';


			icon = {
				url: iconPath,
				size: new google.maps.Size(60, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(30, 71),
				scaledSize: new google.maps.Size(60, 71)
			}

			latLng = new google.maps.LatLng(lat, lng);

			marker = new google.maps.Marker({
				position: latLng,
				map: map,
				icon: icon,
				title: title
			});
		}

		if (!map) return;

		for (var i = 0; i < markers.length; i++) {
			add(markers[i], i);
		}
	}

	var init = function() {
		_handleChange();

		store.eventEmitter.subscribe(_handleChange);
	}

	return {
		init: init
	}
});