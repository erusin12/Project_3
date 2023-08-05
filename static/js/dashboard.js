
// Define a function to get marker color based on accident class
function getColor(accClass) {
  return accClass === 'Fatal' ? 'red' : 'blue';
}

// Select elements
const yearDropdown = document.getElementById('yearDropdown');
const mapContainer = document.getElementById('map');

// Your Leaflet map setup and code here
var mapCenter = [39.8283, -98.5795];
var mapZoom = 4;

fetch('/get_geojson')
  .then(response => response.json())
  .then(geojsonFeature => {
    if (geojsonFeature.features) {
      const years = new Set(geojsonFeature.features.map(feature => feature.properties.YEAR));
      years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.text = year;
        yearDropdown.appendChild(option);
      });
    }
    // Create a GeoJSON layer and add it to the map
    L.geoJSON(geojsonFeature, {
      pointToLayer: function (feature, latlng) {
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
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          `<strong>Year:</strong> ${feature.properties.YEAR}<br><strong>Location:</strong> ${feature.properties.STREET1}<br><strong>Accident Class:</strong> ${feature.properties.ACCLASS}`
        );
      }
    }).addTo(map);

    // Event listener for year dropdown change
    yearDropdown.addEventListener('change', () => {
      const selectedYear = parseInt(yearDropdown.value);

      // Filter the GeoJSON data based on the selected year
      const filteredData = geojsonFeature.features.filter(feature => feature.properties.YEAR === selectedYear);

      // Remove existing GeoJSON layer from the map
      map.eachLayer(layer => {
        if (layer instanceof L.GeoJSON) {
          map.removeLayer(layer);
        }
      });

      // Create a new GeoJSON layer with filtered data and add it to the map
      const filteredGeoJSONLayer = L.geoJSON(filteredData, {
        pointToLayer: function (feature, latlng) {
          // Same marker customization logic as before
        },
        onEachFeature: function (feature, layer) {
          // Same popup customization logic as before
        }
      }).addTo(map);

      // ... (rest of the code for the event listener)
    });

    // Create legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
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

  })
  .catch(error => console.error('Error fetching GeoJSON data:', error));
