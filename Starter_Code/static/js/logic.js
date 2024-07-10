
// URL to fetch earthquake data
const earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Function to fetch and visualize the data
d3.json(earthquakeUrl).then(data => {
  createMap(data.features);
});

function createMap(earthquakeData) {
  // Map initialization
  const map = L.map('map').setView([20, 0], 2);

  // Adding tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
  }).addTo(map);

  // Function to get color based on depth
  function getColor(depth) {
    return depth > 90 ? '#e51f1f' :
           depth > 70 ? '#FF4500' :
           depth > 50 ? '#f2a134' :
           depth > 30 ? '#f7e379' :
           depth > 10 ? '#bbdb44' :
                        '#44ce1b';
  }

  // Function to get radius based on magnitude
  function getRadius(magnitude) {
    return magnitude * 4;
  }

  // Adding markers
  earthquakeData.forEach(feature => {
    const coords = feature.geometry.coordinates;
    const magnitude = feature.properties.mag;
    const depth = coords[2];

    const markerOptions = {
      radius: getRadius(magnitude),
      fillColor: getColor(depth),
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };

    L.circleMarker([coords[1], coords[0]], markerOptions)
      .bindPopup(`<h3>Magnitude: ${magnitude}</h3><hr><p>Depth: ${depth} km</p>`)
      .addTo(map);
  });

  // Adding legend
  const legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');
    const depths = [-10, 10, 30, 50, 70, 90];

    // Loop through the intervals to generate a label with a colored square for each interval
    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<div><i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km' : '+ km') + '</div>';
    }

    return div;
  };

  legend.addTo(map);
}
