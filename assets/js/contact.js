var map;
$(document).ready(function(){
	map = new GMaps({
		div: '#map',
		lat: -37.5432394,
		lng: 175.7110513
	});
	var marker = map.addMarker({
		lat: -37.5432394,
		lng: 175.7110513,
		title: 'Adrian Worsley'
	});
});