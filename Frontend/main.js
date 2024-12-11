// Fetch data for Chart 1
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
                },
                plugins: {
                    legend: {
                        display: false  // Gemmer den forklarende boks
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
                },
                plugins: {
                    legend: {
                        display: false  // Gemmer den forklarende boks
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data for Chart 2:', error));


const chartDivs = ["chart1-container", "chart2-container", "chart3-container"];

// Function to toggle charts
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

//Chart 3
let map; // Declare the map variable globally

// Initialize the map for Chart 3
function initMap() {
    fetch('http://localhost:3000/chart3') // Dine kortdata
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            return response.json(); // Data der kommer fra din chart3 endpoint
        })
        .then(data => {
            map = L.map('map', {
                scrollWheelZoom: false,
                doubleClickZoom: false,
                boxZoom: false,
                keyboard: false,
                zoomControl: true,
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
            // Tilføj OpenStreetMap lag
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(map);

            // Indlæs GeoJSON for landenes grænser og datapunkter
            fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
                .then(response => response.json())
                .then(geojson => {
                    L.geoJSON(geojson, {
                        style: function (feature) {
                            const countryData = data.find(country => feature.properties.name.trim().toLowerCase() === country.country.trim().toLowerCase());
                            return {
                                color: countryData ? 'black' : 'gray',
                                fillColor: countryData ? getPostTypeColor(countryData.post_type.trim().toLowerCase()) : 'transparent',
                                weight: 1,
                                fillOpacity: 0.7,
                            };
                        },
                        onEachFeature: function (feature, layer) {
                            let originalName = feature.properties.name; // Store the original name
                            if (originalName.trim().toLowerCase() === "united kingdom") {
                                feature.properties.name = "Wales"; // Temporarily change name to Wales for styling
                            }
                            const countryData = data.find(c => c.country.trim().toLowerCase() === originalName.trim().toLowerCase());
                            if (countryData) {
                                layer.bindPopup(`
<b>Wales</b><br> <!-- Always display 'Wales' -->
                                    Post Type: ${countryData.post_type}<br>
                                    Total Interactions: ${countryData.total_interactions}`);
                            }
                        }
                }).addTo(map)
                .on('mouseover', function (e) {
                    if (e.layer.feature.properties.name === "Malta") {
                        map.flyTo([35.8997, 14.5146], 6); // Zoom in on Malta
                        map.once('mouseout', function () {
                            setTimeout(() => map.flyTo([49.5260, 16.2551], 4)); // Ensure proper reset with delay
                        });
                    }
                });

            map.invalidateSize();
        })
        .catch(error => console.error('Error loading GeoJSON:', error));
})
.catch(error => console.error('Error initializing chart 3 map:', error));
}
// }

// Helper function to get the color for each post type
function getPostTypeColor(postType) {
    const postTypeColors = {
        video: 'red',
        photo: 'blue',
        share: 'green',
    };
    return postTypeColors[postType] || 'transparent'; // Default to transparent if post type is not found
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
                        label: 'Posts supporting Ukraine',
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

let currentChartIndex = 0; // Start with the first chart

function nextChart() {
    // Gør det tidligere aktive chart/kort usynligt
    document.getElementById(chartDivs[currentChartIndex]).style.display = 'none';

    // Beregn det næste chart/kort
    currentChartIndex = (currentChartIndex + 1) % chartDivs.length;

    // Gør det nuværende chart/kort synligt og check for Leaflet kortet (chart3)
    const nextChartContainer = document.getElementById(chartDivs[currentChartIndex]);
    nextChartContainer.style.display = 'block';

    if (chartDivs[currentChartIndex] === "chart3-container") {
        if (!map) {
            initMap(); // Initialiser kun én gang
        } else {
            setTimeout(() => map.invalidateSize(), 200); // Opdater kortstørrelsen
        }
    }
}









