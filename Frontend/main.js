function toggleChart(chartId) {
    const chartContainer = document.getElementById(chartId + '-container');
    if (chartContainer.style.display === 'none' || chartContainer.style.display === '') {
        chartContainer.style.display = 'block'; // Show the chart
    } else {
        chartContainer.style.display = 'none'; // Hide the chart
    }
}

// Fetch data for Chart 1
fetch('http://localhost:3000/chart1')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
        return response.json();
    })
    .then(data => {
        const labels = data.map(item => item.category);  // Categories for the x-axis
        const values = data.map(item => item.total_interactions);  // Total interactions for the y-axis

        const ctx = document.querySelector('#chart1').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Interactions by Category',
                    data: values,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data for Chart 1:', error));

// Fetch data for Chart 2
fetch('http://localhost:3000/chart2')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
        return response.json();
    })
    .then(data => {
        const labels = data.map(item => item.post_type);  // Post types for the x-axis
        const values = data.map(item => item['SUM(total_interactions)']);  // Interactions for the y-axis

        const ctx = document.querySelector('#chart2').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Interactions by Post Type',
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data for Chart 2:', error));

// Function to toggle visibility of charts and map
function toggleChart(chartId) {
    const chartContainer = document.getElementById(chartId + '-container');
    if (chartContainer.style.display === 'none' || chartContainer.style.display === '') {
        chartContainer.style.display = 'block'; // Show the chart or map
        if (chartId === 'chart3') {
            initMap(); // Initialize map only when chart3 is shown
        }
    } else {
        chartContainer.style.display = 'none'; // Hide the chart or map
    }
}

// Initialize the map for Chart 3
function initMap() {
    // Fetch data for chart3
    fetch('http://localhost:3000/chart3')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            return response.json();
        })
        .then(data => {
            // Initialize the map centered on Europe, with interactions disabled
            const map = L.map('map', {
                scrollWheelZoom: false,
                doubleClickZoom: false,
                boxZoom: false,
                keyboard: false,
                zoomControl: true // Enable zoom control
            }).setView([49.5260, 16.2551], 4); // Default zoom level for Europe

            // Add a legend to the map
            const legend = L.control({ position: 'bottomleft' }); // Choose position: 'topleft', 'topright', 'bottomleft', 'bottomright'

            legend.onAdd = function () {
                const div = L.DomUtil.create('div', 'legend'); // Create a div with a class "legend"
                div.innerHTML = `
                    <h4>Post Types</h4>
                    <i style="background: red"></i> Video<br>
                    <i style="background: blue"></i> Photo<br>
                    <i style="background: green"></i> Share<br>`;
                return div;
            };
            legend.addTo(map);

            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(map);

            // Load GeoJSON data for countries
            fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
                .then(response => response.json())
                .then(geojson => {
                    // Add GeoJSON data to the map
                    L.geoJSON(geojson, {
                        style: function (feature) {
                            const countryData = data.find(country => country.country === feature.properties.name);
                            let color = 'transparent'; // Default to transparent if no data

                            if (feature.properties.name === 'United Kingdom') {
                                color = countryData ? getPostTypeColor(countryData.post_type) : 'transparent';
                            } else {
                                color = countryData ? getPostTypeColor(countryData.post_type) : 'transparent';
                            }
                            return {
                                fillColor: color,
                                weight: countryData ? 1 : 0, // Remove border if no data
                                opacity: 1,
                                color: 'black',
                                fillOpacity: 0.7
                            };
                        },
                        onEachFeature: function (feature, layer) {
                            const countryData = data.find(country => country.country === feature.properties.name);

                            // Zoom-in on Malta on hover
                            if (feature.properties.name === 'Malta') {
                                layer.on('mouseover', function () {
                                    map.setView(layer.getBounds().getCenter(), 7); // Zoom in on Malta when hovered
                                });
                                layer.on('mouseout', function () {
                                    map.setView([49.5260, 16.2551], 4); // Zoom back to the default view when mouse leaves
                                });
                            }

                            // Hvis landet er Storbritannien, ændres tooltip-titlen til Wales
                            let tooltipTitle = feature.properties.name; // Default to country name
                            if (feature.properties.name === 'United Kingdom') {
                                tooltipTitle = 'Wales'; // Change to Wales for United Kingdom
                            }

                            // Kun tilføj tooltip, hvis landet findes i data
                            if (countryData) {
                                layer.bindTooltip(`
                                    <b>${tooltipTitle}</b><br>  <!-- Vis "Wales" i stedet for "United Kingdom" -->
                                    Post Type: ${countryData.post_type}<br>
                                    Total Interactions: ${countryData.total_interactions.toLocaleString()}
                                `, { sticky: true }); // `sticky` gør, at tooltip følger musen
                            }
                        }
                    }).addTo(map);

                    // Adjust the map to fit the container after adding GeoJSON
                    map.invalidateSize();
                })
                .catch(error => console.error('Error loading GeoJSON data:', error));
        })
        .catch(error => console.error('Error fetching data for Chart 3:', error));
}

// Helper function to get the color for each post type
function getPostTypeColor(postType) {
    const postTypeColors = {
        video: 'red',
        photo: 'blue',
        share: 'green',
    };
    return postTypeColors[postType] || 'transparent'; // Default to transparent if post type is not found
}

// Fetch data for Chart 4
fetch('http://localhost:3000/chart4')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
        return response.json();
    })
    .then(data => {
        // Extract labels and values
        const labels = data.map(item => `${item.category} (${item.country})`); // Combine category and country
        const values = data.map(item => item.total_interactions); // Total interactions

        // Chart configuration
        const ctx = document.querySelector('#chart4').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Interactions',
                    data: values,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Category (Country)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Total Interactions'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `Interactions: ${context.raw}`;
                            }
                        }
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data for Chart 4:', error));


//fechting data for chart 5 - støtte til ukraine m gpt over tid
fetch('http://localhost:3000/chart5')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
        return response.json();
    })
    .then(data => {
        //gruppere data i for og imod
        //ide til følgende linje kommer fra chatGPT
        // laver et array af årene hvor hvert år kun optræder en gang, fordi der er flere rækker med samme år (for og imod for hvert år)
        const years = [...new Set(data.map(item => item.year))];

        //itereger gennem arrayet og finder alle for+imod
        //d er et enkelt object
        const forData = years.map(year => {
            const item = data.find(d => d.year === year && d.gpt_ukraine_for_imod === "for");
            return item ? item.post_count : 0;
        });

        const imodData = years.map(year => {
            const item = data.find(d => d.year === year && d.gpt_ukraine_for_imod === "imod");
            return item ? item.post_count : 0;
        });

        const ctx = document.querySelector('#chart5').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'For',
                        data: forData,
                        borderColor: '#556B2F',

                    },
                    {
                        label: 'Imod',
                        data: imodData,
                        borderColor: '#800020'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data for Chart 5:', error));
