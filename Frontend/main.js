// Denne sektion henter data fra serveren til det første diagram (chart1)

fetch('http://localhost:3000/chart1') // Sender en GET-anmodning til den lokale servers /chart1-endpoint for at hente diagramdata

    .then(response => { // Behandler det svar, vi har modtaget fra serveren

        if (!response.ok) // Tjekker, om svaret er mislykket (f.eks. 404 eller 500 fejl)

            throw new Error('Netværkssvar var ikke i orden ' + response.statusText); // Kaster en fejl, hvis serverens svar er ugyldigt

        return response.json(); // Konverterer svaret til JSON, da serveren forventes at returnere data i JSON-format
    })
    .then(data => { // Behandler de JSON-data, der blev modtaget fra serveren

        const labels = data.map(item => item.category);  // Uddrager kategorier fra dataene til brug som x-akseetiketter

        const values = data.map(item => item.total_interactions);  // Uddrager totalinteraktioner fra dataene til y-akseværdier

        const ctx = document.querySelector('#chart1').getContext('2d'); // Vælger canvas-elementet for chart1 og henter dets tegnekontekst

        new Chart(ctx, { // Opretter en ny Chart.js instans for at vise diagrammet

            type: 'bar', // Angiver diagramtypen som "bar"

            data: { // Data for diagrammet, inklusive etiketter og datasæt

                labels: labels, // Sætter x-akseetiketterne ved hjælp af de uddragne kategoridata

                datasets: [{ // Definerer datasættet, der bruges til diagrammet

                    label: 'Total interaktioner pr. kategori', // Forklarende tekst for datasættet

                    data: values, // Y-akseværdier (total interaktioner) for hver kategori

                    backgroundColor: 'rgba(54, 162, 235, 0.2)', // Halvgennemsigtig blå for søjlebakgrunde

                    borderColor: 'rgba(54, 162, 235, 1)', // Blå kant til søjler

                    borderWidth: 1 // Tykkelse af søjlekant
                }]
            }, // End of datasets array

            options: { // Konfigurationsindstillinger for diagrammets udseende og opførsel

                responsive: true, // Gør diagrammet responsivt, så det tilpasser sig forskellige skærmstørrelser

                scales: { // Indstillinger for x- og y-akse skaler

                    y: { // Konfiguration for y-aksen

                        beginAtZero: true, // Starter skalaen fra nul

                        grid: { // Gridline-indstillinger for y-aksen
                            display: false // Skjuler gridlines på y-aksen
                        }
                    },
                    x: { // Konfiguration for x-aksen

                        grid: { // Gridline-indstillinger for x-aksen
                            display: false // Skjuler gridlines
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


// Toggle chart sektion
// Bruges til at styre hvilke diagrammer/kontainere der er synlige, når der skiftes mellem dem.
const chartDivs = ["chart1-container", "chart2-container", "chart3-container"];

// Function to toggle charts - Parameter 'chartId' er navnet/id'et på det diagram, der ønskes vist.
function toggleChart(chartId) {
    const chartContainers = document.querySelectorAll('.chart-container'); // Gets all chart divs

    chartContainers.forEach(container => {  // Skjuler alle diagramcontainere ved at sætte deres CSS 'display' stil til 'none'.
        container.style.display = 'none'; // Hide all charts
    });

    const selectedContainer = document.getElementById(chartId + '-container'); // Identificerer og viser den valgte container vha. dens id.
    selectedContainer.style.display = 'block'; // Show the selected chart

    // Her Håndteres chart3 leaflet kort
    if (chartId === 'chart3') { // Hvis det valgte diagram er 'chart3', håndteres Leaflet-kortet (map).

        if (!map) { // Tjekker, om kortet allerede er initialiseret. Hvis ikke, initialiseres det.
            initMap();
        } else {
            // Sikrer, at kortet får korrekt størrelse efter det bliver synligt, da det har display: none.
            setTimeout(() => map.invalidateSize(), 200); // Delay to ensure the container is fully visible
        }
    }
}

//Chart 3 - Kortet
let map; // Declare the map variable globally

// Funktion til at initialisere Leaflet-kortet for Chart 3. Konfigurerer lag, indstillinger og hover-logik.
function initMap() {
    fetch('http://localhost:3000/chart3')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            return response.json(); // Data der kommer fra chart3 endpoint
        })
        .then(data => {
            map = L.map('map', {  // Opretter kort-elementet med konfigurationsindstillinger som deaktiverer zoom-handlinger.
                scrollWheelZoom: false,
                doubleClickZoom: false,
                boxZoom: false,
                keyboard: false,
                zoomControl: true,
            }).setView([49.5260, 16.2551], 4); // Sætter standardvisningen af kortet til en specifik koordinat og zoomniveau.

            const legend = L.control({position: 'bottomleft'}); // Tilføjer en brugerdefineret legend til kortet.

            legend.onAdd = function () { //??
                const div = L.DomUtil.create('div', 'legend');
                div.innerHTML = `
                    <h4>Posttype most interacted with</h4>
                    <i style="background: royalblue"></i> Video<br>
                    <i style="background: darkred"></i> Photo<br>
                    <i style="background: yellow"></i> Share<br>`;
                return div;
            };
            legend.addTo(map);

            // Tilføj OpenStreetMap lag
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(map);

            // Indlæs GeoJSON for landenes grænser og datapunkter
            fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
                .then(response => response.json())
                // Loader et GeoJSON-lag, som indeholder konturdata for lande, og definerer deres visualisering.
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
                            // Gemt originalnavn for hver country-feature fra GeoJSON-data.
                            let originalName = feature.properties.name; // Store the original name
                            // Hvis navnet på landet er UK så ændres det til Wales
                            if (originalName === "United Kingdom") {
                                const displayName = "Wales"; //Use "Wales" for visual purposes
                                const countryData = data.find(c => c.country.trim().toLowerCase() === originalName.trim().toLowerCase());
                                if (countryData) {
                                    layer.bindPopup(`
                                            <b>${displayName}</b><br> 
                                            Post Type: ${countryData.post_type}<br>
                                            Total Interactions: ${countryData.total_interactions}`);
                                                                }
                                return; // Skip rest of logic for United Kingdom
                            }
                            const countryData = data.find(c => c.country.trim().toLowerCase() === originalName.trim().toLowerCase());
                            if (countryData) {
                                layer.bindPopup(`
                            <b>${originalName}</b><br> 
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

// Hjælpefunktion der returnerer den tilsvarende farve for en specifik 'post type'.
function getPostTypeColor(postType) {
    const postTypeColors = {
        video: 'royalblue',
        photo: 'darkred',
        share: 'yellow',
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


const images = ["Frontend/Pictures/1.png", "Frontend/Pictures/2.png", "Frontend/Pictures/3.png", "Frontend/Pictures/4.png", "Frontend/Pictures/5.png"];
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

