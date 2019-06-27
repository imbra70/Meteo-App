// hhttps://www.youtube.com/watch?v=nZaZ2dB6pow&list=PLRqwX-V7Uu6YxDKpFzf_2D84p0cyk4T7X&index=7
// dati da: https://api.wheretheiss.at/v1/satellites/25544
// https://leafletjs.com/
// https://commons.wikimedia.org/wiki/File:International_Space_Station.svg (poi scaricato come png a 200px)

const mymap = L.map('myMap');

// create the tile layer with correct attribution
const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
const osm = new L.TileLayer(osmUrl, {
  minZoom: 1,
  maxZoom: 18,
  attribution: osmAttrib
});
mymap.addLayer(osm);

const myIcon = L.icon({
  iconUrl: 'favicon.ico',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});
const myMarker = L.marker([20, 0], {
  icon: myIcon
}).addTo(mymap);

if ("geolocation" in navigator) {
  console.log('geolocation is available');
  navigator.geolocation.getCurrentPosition(async position => { // arrow notation per eseguire il codice una volta disponibile la position
    //console.log(position.coords);

    // questo qui sotto si chiama "JavaScript destructuring" (estrae alcuni campi puntuali da un oggetto)
    const {
      latitude,
      longitude
    } = position.coords;
    myMarker.setLatLng([latitude, longitude]);
    mymap.setView([latitude, longitude], 13);

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    document.getElementById('dom_lat').textContent = lat.toFixed(4);
    document.getElementById('dom_lon').textContent = lon.toFixed(4);
    const umore = document.getElementById('umore').value;
    const meteo_api_url = `/meteo/${lat.toFixed(4)},${lon.toFixed(4)}`
    const meteo_response = await fetch(meteo_api_url);
    const meteo_json = await meteo_response.json();
    console.log(meteo_json);
    document.getElementById('dom_summary').textContent = meteo_json.summary;
    document.getElementById('dom_temp').textContent = meteo_json.temperature;

    const data = {
      lat,
      lon,
      umore,
      meteo_json
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    const response = await fetch('/api', options);
    const resp_data = await response.json();
    console.log(resp_data);
  });
} else {
  console.log('geolocation is NOT available');
};
