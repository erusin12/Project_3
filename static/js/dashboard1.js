
// Initialize the dashboard
function init() {
  // Select elements
  const yearDropdown = document.getElementById('yearDropdown');
  const mapContainer = document.getElementById('map');
  const lineGraphContainer = document.getElementById('lineGraph');
  // Create initial blank map
  var mapCenter = [43.748530, -79.393442];
  var mapZoom = 11;
  var map = L.map('map').setView(mapCenter, mapZoom);

// Creates the street map, as well as attributions.
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
// Creates the topographic map, as well as attributions.
var topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
});

// Creates baseMaps object to contain the street and topograhic maps.
var baseMaps = {
    "OpenStreetMap": osm,
    "Topo": topo
};

// Set the default layer
osm.addTo(map); 

// Create layer control containing baseMaps and overlayMaps, add them to the map.
L.control.layers(baseMaps).addTo(map);


  // Fetch GeoJSON data using AJAX
  console.log('Fetching GeoJSON data...');
  fetch('/get_geojson')
    .then(response => response.json())
    .then(geojsonFeature => {
      console.log('GeoJSON Feature:', geojsonFeature);

      // Populate dropdown options
      if (geojsonFeature.features) {
        const years = new Set(geojsonFeature.features.map(feature => feature.properties.YEAR));
        years.forEach(year => {
          const option = document.createElement('option');
          option.value = year;
          option.text = year;
          yearDropdown.appendChild(option);
        });
      }

      // Define a function to get marker color based on accident class
      function getColor(accClass) {
        return accClass === 'Fatal' ? 'red' : 'blue';
      }

      // Create a GeoJSON layer and add it to the map
      L.geoJSON(geojsonFeature, {
        pointToLayer: function(feature, latlng) {
          var accClass = feature.properties.ACCLASS;
          var markerColor = accClass === 'Fatal' ? 'red' : 'blue';

          return L.circleMarker(latlng, {
            radius: 6,
            fillColor: markerColor,
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });
        },
        onEachFeature: function(feature, layer) {
          layer.bindPopup(
            `<strong>Year:</strong> ${feature.properties.YEAR}<br><strong>Location:</strong> ${feature.properties.STREET1}<br><strong>Accident Class:</strong> ${feature.properties.ACCLASS}`
          );
        }
      }).addTo(map);

      // Event listener for year dropdown change
      yearDropdown.addEventListener('change', () => {
        const selectedYear = parseInt(yearDropdown.value);

        // Filter the GeoJSON data for selected year
        const filteredData = geojsonFeature.features.filter(feature => feature.properties.YEAR === selectedYear);

        // Remove existing GeoJSON layer from the map
        map.eachLayer(layer => {
          if (layer instanceof L.GeoJSON) {
            map.removeLayer(layer);
          }
        });

        // Create a new GeoJSON layer with filtered data
        const filteredGeoJSONLayer = L.geoJSON(filteredData, {
          pointToLayer: function(feature, latlng) {
            var accClass = feature.properties.ACCLASS;
            var markerColor = accClass === 'Fatal' ? 'red' : 'blue';

            return L.circleMarker(latlng, {
              radius: 4,
              fillColor: markerColor,
              color: '#000',
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            });
          },
          onEachFeature: function(feature, layer) {
            layer.bindPopup(
              `<strong>Year:</strong> ${feature.properties.YEAR}<br><strong>Location:</strong> ${feature.properties.STREET1}<br><strong>Accident Class:</strong> ${feature.properties.ACCLASS}`
            );
          }
        }).addTo(map);

        // Update the line graph based on selected year
        updateLineGraph(filteredData);
      });

      // Create legend
      var legend = L.control({
        position: 'bottomright'
      });

      legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend');
        var accClasses = ['Fatal', 'Non-Fatal'];
        var labels = [];

        for (var i = 0; i < accClasses.length; i++) {
          var accClass = accClasses[i];

          var colorBox = `<div style="width: 20px; height: 10px; background:${getColor(accClass)}; display: inline-block;"></div>`;
          var accClassLabel = `${accClass}`;

          labels.push(
            `<div>${colorBox} ${accClassLabel}</div>`
          );
        }

        div.innerHTML = `<div style="background: white; padding: 10px;">${labels.join('')}</div>`;

        return div;
      };

      // Add legend to the map
      legend.addTo(map);

      // Create the line graph using D3.js
      createLineGraph(geojsonFeature);
    })
    .catch(error => console.error('Error fetching GeoJSON data:', error));
}

// Initialize the dashboard
init();
