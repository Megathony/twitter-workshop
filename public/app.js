const $ = document.querySelector.bind(document)

const socket = new WebSocket(`ws://${window.location.hostname}:${window.location.port}`);
let data = {}

function updateData (newMessage) {
    const topicIndex = data.findIndex(topic => topic.title.toLowerCase() === newMessage.value.toLowerCase())
    if (topicIndex > -1) {
        data[topicIndex].numberOfTweets = newMessage.numberOfTweets
        stopLoading()
    }
    render()
}

function render () {
    if (data.length) {
        chart.data.labels = data.map(d => d.title)
        chart.data.datasets[0].data = data.map(d => d.numberOfTweets)
        chart.update()
    }
}

function startLoading () {
    $('#spinner').style.visibility = 'visible'
}
function stopLoading () {
    $('#spinner').style.visibility = 'hidden'
}

const input1 = $('#topic1')
const input2 = $('#topic2')

const ctx = document.getElementById('chart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            data: [0, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        legend: {
            display: false
        }
    }
});


socket.addEventListener("message", async function (event) {
    try {
        const data = JSON.parse(event.data)
        updateData(data)
    } catch(err) {
        console.error(err)
    }
})

document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault()
    if (input1.value && input2.value) {
        data = [
            {
                title: input1.value,
                numberOfTweets: 0
            },
            {
                title: input2.value,
                numberOfTweets: 0
            }
        ]
        const request = JSON.stringify([ input1.value, input2.value ])
        socket.send(request)
        startLoading()
        input1.value = ''
        input2.value = ''
        render()
    }
})

