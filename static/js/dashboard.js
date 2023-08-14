// Create initial blank map
var map = L.map('map').setView([43.748530, -79.393442], 10);

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

// Utilize fetch() to query the geoJSON data and create a dropdown.
fetch('Pedestrians.geojson')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        // Populate the dropdown with unique years from the GeoJSON data
        populateYearDropdown(data);

        // Display markers based on the selected year in the dropdown
        updateMarkersByYear(data, 'all');

        // Event listener for the dropdown change event
        document.getElementById('yearFilter').addEventListener('change', function() {
            var selectedYear = this.value;
            updateMarkersByYear(data, selectedYear);
        });
    });
// Creates a dropdown to hold the years.
function populateYearDropdown(data) {
    var yearSet = new Set();
    data.features.forEach(function(feature) {
        var year = feature.properties.YEAR;
        yearSet.add(year);
    });

    var yearDropdown = document.getElementById('yearFilter');
    // Clear existing options
    yearDropdown.innerHTML = ''; 
    var allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.text = 'All Years';
    yearDropdown.appendChild(allOption);

    yearSet.forEach(function(year) {
        var option = document.createElement('option');
        option.value = year;
        option.text = year;
        yearDropdown.appendChild(option);
    });
}
// Update each of the markers by selected year.
function updateMarkersByYear(data, selectedYear) {
    map.eachLayer(function(layer) {
        if (layer instanceof L.CircleMarker) {
            map.removeLayer(layer);
        }
    });
// Creates a features properties for each year as well as bindpop for District, Date, Injury, and road conditions.
// Creates an filter to captuer all of the yearly data.     
// Add the features to the map. 
    L.geoJSON(data, {
        filter: function(feature, layer) {
            return selectedYear === 'all' || feature.properties.YEAR.toString() === selectedYear
        },
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 8,
                fillColor: getColor(feature.properties.ACCLASS),
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
            }).bindPopup(`<h3>District: ${feature.properties.DISTRICT}</h3><hr><p>Date: ${new Date(feature.properties.DATE)}</p><p>Injury: ${feature.properties.ACCLASS}</p><p>Road Conditions: ${feature.properties.RDSFCOND}</p>`);
        }
    }).addTo(map);
}

// Create markers for the ACCLASS "Fatal" category as "red" and others as blue. 
function getColor(ACCLASS) {
    return ACCLASS === 'Fatal' ? 'red' : 'blue';
}
// Import the geojson data to generate a line chart for each accident and by month and year.
$.getJSON('Pedestrians.geojson', function(data) {
    var accidents = data.features;

    var years = [...new Set(accidents.map(accident => new Date(accident.properties.DATE).getFullYear()))];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Create a drop down feature for each year.
    var dropdownYear = document.getElementById('year-dropdown');
    years.forEach(function(year) {
        var option = document.createElement('option');
        option.text = year;
        option.value = year;
        dropdownYear.appendChild(option);
    });

    var chartContainer = document.getElementById('chart-container');
    var defaultYear = years[0];
    updateChart(defaultYear);

    dropdownYear.addEventListener('change', function() {
        var selectedYear = parseInt(this.value);
        updateChart(selectedYear);
    });
// 
    function updateChart(selectedYear) {
        var traces = [];

        var filteredAccidents = accidents.filter(accident => new Date(accident.properties.DATE).getFullYear() === selectedYear);

        var monthlyCounts = Array.from({ length: 12 }, () => 0);
        filteredAccidents.forEach(accident => {
            var month = new Date(accident.properties.DATE).getMonth();
            monthlyCounts[month]++;
        });

        var trace = {
            x: months,
            y: monthlyCounts,
            mode: 'lines+markers',
            type: 'scatter',
            name: `${selectedYear}`
        };

        traces.push(trace);

        var layout = {
            title: `Accidents by Month for ${selectedYear}`,
            xaxis: {
                title: 'Month'
            },
            yaxis: {
                title: 'Accident Count'
            }
        };

        Plotly.newPlot(chartContainer, traces, layout);
    }
});

// Fetch and load the Pedestrians.geojson file
fetch('Pedestrians.geojson')
  .then(response => response.json())
  .then(data => {
    const geojsonData = data;
    
   // Process the data and create the chart
const processedData = geojsonData.features.map(feature => ({
    ACCLASS: feature.properties.ACCLASS,
    RDSFCOND: feature.properties.RDSFCOND
  }));
  
  // Filter out entries with null or undefined road conditions
  const filteredData = processedData.filter(item => item.ACCLASS === 'Fatal' && item.RDSFCOND);
  
  const roadConditionCounts = {};
  filteredData.forEach(item => {
    const roadCondition = item.RDSFCOND;
    roadConditionCounts[roadCondition] = (roadConditionCounts[roadCondition] || 0) + 1;
  });
  
  const roadConditions = Object.keys(roadConditionCounts);
  const roadConditionCountsArray = Object.values(roadConditionCounts);
  
  // Create a smaller chart dimensions
  const config = {
    type: 'doughnut',
    data: {
      labels: roadConditions,
      datasets: [{
        data: roadConditionCountsArray,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#F7464A'
        ]
      }]
    },
    options: {
      responsive: true,
      aspectRatio: 2, 
      cutoutPercentage: 60,
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Fatal Accidents by Road Conditions'
      }
    }
  };
    const ctx = document.getElementById('donutChart').getContext('2d');
    new Chart(ctx, config);
  })
  .catch(error => console.error('Error loading GeoJSON:', error));

// Create a legend control to display the ACCLASS legend
var legend = L.control({position: 'bottomright'});

// Function to generate the legend content based on colors and labels
legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend');
    // ACCLASS values
    var grades = ['Fatal', 'Non-Fatal Injury']; 
    // Corresponding colors
    var colors = ['red', 'blue']; 

    // Loop through each ACCLASS value and generate a legend item
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            grades[i] + '<br>';
    }

    return div;
};

// Add the legend to the map
legend.addTo(map); 



