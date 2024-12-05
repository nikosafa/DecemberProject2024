Table 1: classification
ccpost_id
all_post_text
gpt_ukraine_for_imod
Table 2: sourcepop
ccpageid
name
party
category
country
Table 3: time
ccpost_id
date
day
month
time
yearweek
yearmonth
yearquarter
year
Table 4: metrics
ccpost_id
ccpageid
post_type
video_length
followers_at_posting
reactions
likes
loves
wows
sads
hahas
angrys
cares
comments
shares
total_interactions
engagement_rate
proportion_of_likes
proportion_of_loves
proportion_of_hahas
proportion_of_wows
proportion_of_sads
proportion_of_angrys
proportion_of_cares
proportion_of_shares
proportion_of_comments
proportion_of_reactions






<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chart.js Map Example</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-chart-geo"></script>
</head>
<body>
    <canvas id="myMap" width="600" height="400"></canvas>
    <script>
        const ctx = document.getElementById('myMap').getContext('2d');

        const myMap = new Chart(ctx, {
            type: 'geo', // Specify the type of chart as geo
            data: {
                // Define your data here
                datasets: [{
                    // Example data
                    data: [
                        {feature: 'US', value: 100},
                        {feature: 'CA', value: 50}
                    ],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                // Configuration options here
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                    }
                }
            }
        });
    </script>
</body>
</html>
