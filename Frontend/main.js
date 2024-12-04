// Function to toggle the display of the chart containers
function toggleChart(chartId) {
    const chartContainer = document.getElementById(chartId + '-container');
    if (chartContainer.style.display === 'none' || chartContainer.style.display === '') {
        chartContainer.style.display = 'block'; // Show the chart
    } else {
        chartContainer.style.display = 'none'; // Hide the chart
    }
}

fetch('http://localhost:3000/chart1')
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then((data) => {
        console.log('Fetched data for chart1:', data);


        const labels = data.map(item => item.category);
        const values = data.map(item => item.total_interactions);


        const ctx1 = document.querySelector('#chart1').getContext('2d');

        new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Interactions by Category',
                    data: values,
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
    .catch((error) => {
        console.error('Error fetching data for chart1:', error);
    });


//chart 2
//først fanger vi dataen fra endpointet
//const data =

// Fetch data from the /chart2 endpoint
fetch('http://localhost:3000/chart2')
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then((data) => {
        console.log('Fetched data:', data);

        // Map the fetched data to labels and values
        const labels = data.map(item => item.post_type);
        const values = data.map(item => item['SUM(total_interactions)']);

        // Get the canvas context for chart2
        const ctx = document.querySelector('#chart2').getContext('2d');

        // Create the line chart
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Interactions by Post Type',
                    data: values,
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
    .catch((error) => {
        console.error('Error fetching data:', error);
    });
