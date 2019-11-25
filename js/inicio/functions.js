var mainMap;
var layerBase;
var markerFuga = null;
var popup = null;
var onClickMap = function(evt){
  if (markerFuga != null){
    markerFuga.setLatLng(evt.latlng);
    popup.setContent("Latitud:" + evt.latlng.lat +" Longitud" + evt.latlng.lng);
    markerFuga.on('dragend', onMoveMarker);
    inversaGeocode(evt.latlng.lat,evt.latlng.lng);
    markerFuga.dragging.enable();
  } else {
    markerFuga = L.marker(evt.latlng, {draggable:true,autoPan: true})
    .addTo(mainMap);
    markerFuga.on('dragend', onMoveMarker);
    popup = L.popup()
    .setLatLng(evt.latlng)
    .setContent("Latitud:" + evt.latlng.lat +" Longitud" + evt.latlng.lng)

    markerFuga.bindPopup(popup).openPopup();
    inversaGeocode(evt.latlng.lat,evt.latlng.lng);
    markerFuga.dragging.enable();
  }
}

var onMoveMarker = function(evt) {
    console.log(evt.target);
    var latLng = evt.target.getLatLng();
    markerFuga.setLatLng(latLng);
    popup.setContent("Latitud:" + latLng.lat +" Longitud" + latLng.lng);
    inversaGeocode(latLng.lat,latLng.lng);


};

var inversaGeocode = function(lat,lng){
  var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+lng+","+lat+".json?access_token=pk.eyJ1IjoiZGV2YWxyYXBhIiwiYSI6ImNqeHkycHQwZTA1ajMzZm10NDZpZGhkMzkifQ.oF_m4TaHex8g8QQvl2deJQ";
  $("#adress").html("");
  $("#latitude").html(lat);
  $("#longitude").html(lng);
  fetch(url,{
     method:'GET',
     headers:{
        'Accept': 'application/json',
        'content-type': 'application/json'
     }
  }).then(response => {
     return response.json();
  }).then(data =>{
     infoGeocode(data);
  });
}

var infoGeocode = function(data){
    const url = data.features[0].text + "," + data.features[1].place_name;
    $("#adress").html(url);
}
