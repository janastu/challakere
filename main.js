var count = 0;
var map;
var markers = new L.LayerGroup();
var photos = new L.LayerGroup();
function init(){
	var tileLayer = L.tileLayer('http://{s}.tile.cloudmade.com/157f9082094e402f89d242e9b9144483/997/256/{z}/{x}/{y}.png', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â©<a href="http://cloudmade.com">CloudMade</a>'
	});
	var overlays = {
		"Places" : markers,
		"Photos": photos
	};
	var baseLayer = {
		"Base Map": tileLayer
	};
	map = L.map('map', {layers:[tileLayer, markers, photos]}).setView([14.31336, 76.64973], 13);
	map.minZoom = 13;
	map.maxZoom = 13;
	map.zoomControl = false;
	L.control.scale({position: 'bottomleft'}).addTo(map);
	L.control.layers(baseLayer, overlays).addTo(map);
	loadWayPoints();
	loadTrackPoints();

}
function loadWayPoints(){
	var wayPointList = ['drdoway.json', 'iiscway.json', 'iiscway2.json'];
	for(var i=0; i<wayPointList.length;i++) {
		$.get(wayPointList[i], function(keys){
			L.geoJson(keys, {
				pointToLayer: function(feature, latlng) {
					if(feature.properties.name != "Picture") {
						var m =  L.marker(latlng).bindLabel(feature.properties.name, {noHide: true}).addTo(markers);
						if(i == wayPointList.length){
							this.appendLabels(markers);
						}
						return m;
					}
					else {
						count++;
						var m =  L.marker(latlng).bindLabel(count.toString(), {noHide: true}).addTo(photos);
						var template = _.template($('#image-item-template').html());
						x = $('body').append(template({cnt: count, src: feature.properties.link1_href}));
						m.on('click',function(e){
							e.target.bindPopup("<img src='"+feature.properties.link1_href+"' style='height:200px;width:200px;'>").openPopup();
						});
						if(i == wayPointList.length){
							this.appendLabels(photos);
						}
						return m;
					}
				}
			}).addTo(map);
		},'json');
	}
}
function appendLabels(x){
	x.eachLayer(function(layer){
		layer.showLabel();
	});
}


function loadTrackPoints() {
	var trackPointList = ['drdo.json', 'iisctrack.json', 'kaaval.json'];
	for(var i=0; i<trackPointList.length;i++) {
		$.get(trackPointList[i], function(keys){
			L.geoJson(keys, {
				style: {
					color: '#ff0000',
					weight: 2,
					opacity: 1
				}
			}).addTo(map);
		},'json');
	}
}