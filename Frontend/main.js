/*function toggleChart(chartId) {
    const chartContainer = document.getElementById(chartId + '-container');
    if (chartContainer.style.display === 'none' || chartContainer.style.display === '') {
        chartContainer.style.display = 'block'; // Show the chart
        if (chartId === 'chart3') {
            initMap(); // Initialize map only when chart3 is shown
        }
    } else {
        chartContainer.style.display = 'none'; // Hide the chart
    }
}
 */

//forsøg på at der kommer forklarende tekst op når man trykker på billederne




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
                        beginAtZero: true,
                        grid: {
                            display: false
                        }
                    },
                    x: {
                       grid: {
                           display: false // Fjerner gridlines
                       }
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
                        beginAtZero: true,
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false // Fjerner gridlines
                        }
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data for Chart 2:', error));

function toggleChart(chartId) {
    const chartContainers = document.querySelectorAll('.chart-container'); // All chart divs
    chartContainers.forEach(container => {
        container.style.display = 'none'; // Hide all charts
    });

    const selectedContainer = document.getElementById(chartId + '-container');
    selectedContainer.style.display = 'block'; // Show the selected chart

    if (chartId === 'chart3') {
        if (!map) {
            initMap(); // Initialize the map if it hasn't been initialized yet
        } else {
            setTimeout(() => map.invalidateSize(), 200); // Delay to ensure the container is fully visible
        }
    }
}


let map; // Declare the map variable globally

// Initialize the map for Chart 3
function initMap() {
    fetch('http://localhost:3000/chart3')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            return response.json();
        })
        .then(data => {
            map = L.map('map', {
                scrollWheelZoom: false,
                doubleClickZoom: false,
                boxZoom: false,
                keyboard: false,
                zoomControl: true
            }).setView([49.5260, 16.2551], 4);

            // Add a legend to the map
            const legend = L.control({ position: 'bottomleft' });

            legend.onAdd = function () {
                const div = L.DomUtil.create('div', 'legend');
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
                            const color = countryData ? getPostTypeColor(countryData.post_type) : 'transparent';
                            return {
                                fillColor: color,
                                weight: countryData ? 1 : 0,
                                opacity: 1,
                                color: 'black',
                                fillOpacity: 0.7
                            };
                        },
                        onEachFeature: function (feature, layer) {
                            const countryData = data.find(country => country.country === feature.properties.name);
                            if (countryData) {
                                layer.bindTooltip(`
                                    <b>${feature.properties.name}</b><br>
                                    Post Type: ${countryData.post_type}<br>
                                    Total Interactions: ${countryData.total_interactions.toLocaleString()}
                                `, { sticky: true });
                            }
                        }
                    }).addTo(map);

                    map.invalidateSize(); // Ensure the map fits its container
                })
                .catch(error => console.error('Error loading GeoJSON data:', error));
        })
        .catch(error => console.error('Error fetching data for Chart 3:', error));
}
// }

// Toggle between charts and initialize map if needed
function toggleChart(chartId) {
    const chartContainers = document.querySelectorAll('.chart-container'); // All chart divs
    chartContainers.forEach(container => {
        container.style.display = 'none'; // Hide all charts
    });

    const selectedContainer = document.getElementById(chartId + '-container');
    selectedContainer.style.display = 'block'; // Show the selected chart

    if (chartId === 'chart3') {
        if (!map) {
            initMap(); // Initialize the map if it hasn't been initialized yet
        } else {
            setTimeout(() => map.invalidateSize(), 200); // Delay to ensure the container is fully visible
        }
    }
}

// Initialize by showing only the first chart and hiding the rest
function initializeCharts() {
    chartDivs.forEach((chartId, index) => {
        const chartDiv = document.getElementById(chartId);
        chartDiv.style.display = index === 0 ? 'block' : 'none';
    });
}

// Call the initialize function when the page loads
initializeCharts();

// Helper function to get the color for each post type
function getPostTypeColor(postType) {
    const postTypeColors = {
        video: 'red',
        photo: 'blue',
        share: 'green',
    };
    return postTypeColors[postType] || 'transparent'; // Default to transparent if post type is not found
}
/*
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
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Total Interactions'
                        },
                        grid: {
                            display: false
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
 */

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

        const ctx = document.querySelector('#chart5').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'Supporting Ukraine',
                        data: forData,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                //ingen gridlines:
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data for Chart 5:', error));



const images = ["Frontend/1.png", "Frontend/2.png", "Frontend/3.png", "Frontend/4.png", "Frontend/5.png"]; // List of image URLs
let currentIndex = 0;

function nextImage() {
    // Increment the index
    currentIndex = (currentIndex + 1) % images.length; // Loop back to the first image
    // Update the image source
    document.querySelector("#phone-image").src = images[currentIndex];
}

const chartDivs = ["chart1-container", "chart2-container", "chart3-container"];
let currentChartIndex = 0; // Start with the first chart

function nextChart() {
    // Hide the current chart
    document.getElementById(chartDivs[currentChartIndex]).style.display = 'none';

    // Update the index for the next chart
    currentChartIndex = (currentChartIndex + 1) % chartDivs.length;

    // Show the new current chart
    document.getElementById(chartDivs[currentChartIndex]).style.display = 'block';
}
/*
// Initialize by showing only the first chart and hiding the rest
function initializeCharts() {
    chartDivs.forEach((chartId, index) => {
        const chartDiv = document.getElementById(chartId);
        chartDiv.style.display = index === 0 ? 'block' : 'none';
    });
}

// Call the initialize function when the page loads
initializeCharts();

 */


