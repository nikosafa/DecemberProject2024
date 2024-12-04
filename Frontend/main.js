fetch('http://localhost:3000/chart1')
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Convert the response to JSON
    })
    .then((data) => {
        console.log('Fetched data for chart1:', data); // Log to check the fetched data

        // Map the fetched data to labels and values
        const labels = data.map(item => item.category);  // Categories for the x-axis
        const values = data.map(item => item.total_interactions);  // Interactions for the y-axis

        // Get the canvas context for chart1
        const ctx1 = document.querySelector('#chart1').getContext('2d');

        // Create the bar chart for chart1
        new Chart(ctx1, {
            type: 'bar',  // Chart type: bar chart
            data: {
                labels: labels,  // Labels for the x-axis
                datasets: [{
                    label: 'Total Interactions by Category',  // Dataset label
                    data: values,  // Data for the y-axis (total interactions)
                }]
            },
            options: {
                responsive: true,  // Make the chart responsive
                scales: {
                    y: {
                        beginAtZero: true  // Start the y-axis at 0
                    }
                }
            }
        });
    })
    .catch((error) => {
        console.error('Error fetching data for chart1:', error);  // Log any errors
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
        return response.json(); // Convert the response to JSON
    })
    .then((data) => {
        console.log('Fetched data:', data); // Log the fetched data to check its format

        // Map the fetched data to labels and values
        const labels = data.map(item => item.post_type);  // Extract post_type for the x-axis
        const values = data.map(item => item['SUM(total_interactions)']);  // Extract total_interactions for the y-axis

        // Get the canvas context for chart2
        const ctx = document.querySelector('#chart2').getContext('2d');

        // Create the line chart
        new Chart(ctx, {
            type: 'bar',  // Line chart type
            data: {
                labels: labels,  // Labels for the x-axis
                datasets: [{
                    label: 'Interactions by Post Type',  // Label for the dataset
                    data: values,  // Data for the y-axis (total interactions)
                }]
            },
            options: {
                responsive: true,  // Make the chart responsive
                scales: {
                    y: {
                        beginAtZero: true  // Start the y-axis at 0
                    }
                }
            }
        });
    })
    .catch((error) => {
        console.error('Error fetching data:', error);  // Log any errors
    });
