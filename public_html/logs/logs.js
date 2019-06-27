async function getAllTheData() {
  const response = await fetch('/api'); // N.B. stessa URI, ma stavolta è una GET, quindi l'handle nel server è diversa
  const data = await response.json();
  console.log(data);

  // dump nella pagina:
  for (riga of data) {

    const myMarker = L.marker([riga.lat, riga.lon]).addTo(mymap);
    const popupTxt = `<p>Qui (lat: ${riga.lat}&deg;, lon: ${riga.lon}&deg;) <br />
      il tempo &eacute; ${riga.meteo_json.summary} con una temperatura di
      ${riga.meteo_json.temperature}&deg;C.</p>`;
    myMarker.bindPopup(popupTxt);

    const root = document.createElement('p');
    const mood = document.createElement('div');
    const geo = document.createElement('div');
    const date = document.createElement('div');
    const image = document.createElement('img');

    mood.textContent = riga.umore;
    geo.textContent = `lat: ${riga.lat}, lon: ${riga.lon}`;
    const dateString = new Date(riga.timestamp).toLocaleString();
    date.textContent = dateString;
    if (riga.image64) {
      image.src = riga.image64;
      root.append(mood, geo, date, image);
    } else {
      root.append(mood, geo, date);
    }

    document.body.append(root);
  }
}

const mymap = L.map('worldMap');

// create the tile layer with correct attribution
const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
const osm = new L.TileLayer(osmUrl, {
  minZoom: 1,
  maxZoom: 18,
  attribution: osmAttrib
});
mymap.addLayer(osm);
mymap.setView([0, 0], 1);

getAllTheData();
