
# Project Name
Pedestrian Accidents  Project 3 

## Data Location
Source:  https://open.toronto.ca/dataset motor-vehicle-collisions-involving-killed-or-seriously-injured-persons/
Data license: https://open.toronto.ca/open-data-license/


## General Information

This project is a data visualization dashboard for Toronto pedestrian accidents. It aims to provide insights into pedestrian accident trends, locations, and factors such as road surface conditions.  In theory, this can be used by a police department to analyze the pedestrian-related accidents to determine how to reduce fatalities.

### Problem Statement

Pedestrian accidents are a significant concern in Toronto. This project seeks to visualize the data to help stakeholders better understand accident patterns, identify hotspots, and make informed decisions to improve pedestrian safety.

### Purpose

The purpose of this project is to create an interactive dashboard that allows users to explore and analyze pedestrian accident data visually. By providing visual representations of accident locations, trends, and factors, the dashboard facilitates data-driven insights for safety improvements.

### Motivation

The project was undertaken to address the need for a user-friendly platform that visualizes complex accident data. By leveraging modern web technologies and data visualization techniques, the project aims to make data more accessible and actionable.

## Technologies Used

- Jupyter notebook 
- Leaflet 
- MongoDB
- Chart.js (New library used)
- D3.js 
- HTML/CSS
- JavaScript
- Flask

## Versions
Version 1 uses Flask to create a map to view the pedestrian-related accidents with different markers for fatal and non-fatal.  There is a zoom capability and the option to use a street or Topo map.
Version 2 uses an http server to pull up an interactive dashboard with a map, line graph, and a donut chart with the data.  

## Import and viewing Data
Version 1
- Using Jupyter Notebook to view the dataset 
- Use the `mongoimport` command to bring the data into MongoDB
- mongoimport --db pedestrians -c ped_acc --file 'pedestrians.geojson'
Version 2
- Navigate to the appropriate folder and then, using command prompt, run python -m http.server


## Features
Version 1
- Interactive Leaflet Map: Displays pedestrian accidents locations on a map.
Version 2
- Interactive Leaflet Map: Displays pedestrian accidents locations on a map.
- Line Chart: Shows trends of pedestrian accidents over time.
- Donut Chart: Illustrates the distribution of fatal accidents by road surface condition.


## Setup

- Ensure Leaflet, Chart.js, and D3.js dependencies installed.
Verison 1
-Ensure folder set up is as follows:  MAIN FOLDER: app.py file, templates folder, static folder.  
											Inside static folder: css folder, js folder. 
												Inside css folder: styles.css. 
												Inside js folder: dashboard1.js
											Inside templates folder: index1.html
-Navigate to the appropriate folder and run app.py in command prompt and ctrl+C to open the HMTL
Version 2
-Ensure folder set up is as follows:  MAIN FOLDER: index.html, static folder.  
											Inside static folder: css folder, js folder. 
- Paste the http://localhost:8000 into Google Chrome

## Example Code Snippets

### Interactive Leaflet Map

```javascript
// Create initial blank map
var map = L.map('map').setView([43.748530, -79.393442], 11);


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


### Line Chart 
   // Import the geojson data to generate a line chart for each accident and by month and year.
$.getJSON('Pedestrians.geojson', function(data) {
    var accidents = data.features;

    
    // Function to update the line chart with data for the selected year
    function updateChart(selectedYear) {
        // ... (Rest of the code to update and render the line chart)
    }
});

### Donut Chart 
  
  // Fetch and load the Pedestrians.geojson file
fetch('Pedestrians.geojson')
  .then(response => response.json())
  .then(data => {
    const geojsonData = data;

    
    const ctx = document.getElementById('donutChart').getContext('2d');
    new Chart(ctx, config);
  })
  .catch(error => console.error('Error loading GeoJSON:', error));



## Usage

- Select a year from the dropdown to filter data by year.
- Explore the Leaflet map to view pedestrian accident locations.
- Analyze the line chart to identify trends over time.
- Interpret the donut chart to understand fatal accidents by road surface condition.


## Contributors

 - Emily R 
 - Tungalagtuya Naran 
 - Todd Petruska  
 - George Kalad

## Data Sources & Resources


for code troubleshooting : Instructor assistance ,Chatgpt,Blackbox,Google,Stackoverflow

