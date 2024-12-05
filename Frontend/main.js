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
            // Initialize the map centered on Europe
            const map = L.map('map').setView([54.5260, 15.2551], 4); // Adjust the zoom level for Europe

            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(map);

            // Load GeoJSON data for countries (make sure you have a correct GeoJSON URL or path)
            fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
                .then(response => response.json())
                .then(geojson => {
                    // Add GeoJSON data to the map
                    L.geoJSON(geojson, {
                        style: function (feature) {
                            const countryData = data.find(country => country.country === feature.properties.name);
                            const color = countryData ? getPostTypeColor(countryData.post_type) : 'transparent'; // Default to gray

                            return {
                                fillColor: color,
                                weight: countryData ? 1 : 0, // Remove border if no color
                                opacity: 1,
                                color: 'black',
                                fillOpacity: 0.7
                            };
                        },
                        onEachFeature: function (feature, layer) {
                            // Bind a popup to show country and post type information
                            const countryData = data.find(country => country.country === feature.properties.name);
                            if (countryData) {
                                layer.bindPopup(`
                                    <b>${countryData.country}</b><br>
                                    Post Type: ${countryData.post_type}<br>
                                    Total Interactions: ${countryData.total_interactions.toLocaleString()}
                                `);
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
    return postTypeColors[postType] //|| 'gray'; // Default to gray if post type is not found
}


//fechting data for chart 5 - støtte til ukraine m gpt over time
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
