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
