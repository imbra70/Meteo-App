const express = require('express');
const datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
app.use(express.static('public_html')); // si appoggia ad express per servire le pagine statiche presenti nel subfolder
app.use(express.json({
  'limit': '1mb'
})); // per abilitare il server a gestire richiesta JSON

// gestione della persistenza
const database = new datastore('database.db'); // datastore basato sul file in argomento
database.loadDatabase();

// definisce una "route" (l'URI impiegato per offrire servizi) sul metodo POST :
app.post('/api', (request, response) => {
  console.log('Ricevuta una POST!');
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  response.json(data);
});

// definisce una nuova "route" (stessa URI, ma stavolta risponde al GET):
app.get('/api', (request, response) => {
  console.log('Ricevuta una GET!');
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

// definisce una nuova "route" per i dati meteo (proxy verso DarkSky):
// notare la struttura degli argomenti (uno solo che veicola lat e lon)
app.get('/meteo/:latlon', async (request, response) => {
  const latlon = request.params['latlon'].split(',');
  const lat = latlon[0];
  const lon = latlon[1];
  const meteo_API_key = process.env['DARKSKY_API_KEY'];
  const meteo_api_url = `https://api.darksky.net/forecast/${meteo_API_key}/${lat},${lon}/?units=si`
  const meteo_response = await fetch(meteo_api_url);
  const meteo_json = await meteo_response.json();
  const meteo = {};
  meteo.summary = meteo_json.currently.summary;
  meteo.temperature = meteo_json.currently.temperature;
  response.json(meteo);
});
