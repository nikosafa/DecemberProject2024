
//chart 2
//først fanger vi dataen fra endpointet
//const data =

//fetch-kald der henter data  fra endpoint
    fetch('http://localhost:3000/chart2')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Konverterer serverens svar til JSON
        })
        .then((data) => {


            console.log('Fetched data:', data);
            console.log(data.post_type);

            //chart js
            //hapser dele af dataen til labels og til data
                //inspiration til data.map fra chatGPT
            const labels = data.map(item => data.post_type);
            const values = data.map(item => data['SUM(total_interactions)']);


            const ctx = document.querySelector('#chart1').getContext('2d');
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    label: "Hvilen type profiler udbreder sig bedst på FaceBook",
                    datasets: [{
                        label: labels,
                        data: values,
                    }]
                }
            });
        })
        .catch((error) => {
            console.error('Error fetching data:', error); // Logger fejl, hvis noget går galt
        });


//chart 2
