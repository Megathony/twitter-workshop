const $ = document.querySelector.bind(document)

const socket = new WebSocket(`ws://${window.location.hostname}:${window.location.port}`);
let data = {}

function updateData (newMessage) {
    const subjectIndex = data.findIndex(subject => subject.title === newMessage.value)
    if (subjectIndex > -1) {
        data[subjectIndex].numberOfTweets = newMessage.numberOfTweets
        stopLoading()
    }
    render()
}

socket.addEventListener("message", async function (event) {
    try {
        const data = JSON.parse(event.data)
        updateData(data)
    } catch(err) {
        console.error(err)
    }
})

socket.addEventListener('open', function (event) {
    console.log("connected")
});
/*
{"value":"reconfinement3","clients":["f6bd403b-378a-4323-a109-c9ec3101fd64"],"numberOfTweets":9,"tag":"424a724e-fd84-4c59-8097-53dcfb82e1a6"}
 */

const input1 = $('#subject1')
const input2 = $('#subject2')
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

function render () {
    if (data.length >= 2) {
        $('#subject1-title').innerText = data[0].title
        $('#subject1-data').innerText = data[0].numberOfTweets
        $('#subject2-title').innerText = data[1].title
        $('#subject2-data').innerText = data[1].numberOfTweets
    }
}

function startLoading () {
    $('#spinner').style.visibility = 'visible'
}
function stopLoading () {
    $('#spinner').style.visibility = 'hidden'
}
render()

const ctx = document.getElementById('chart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue'],
        datasets: [{
            data: [12, 19],
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
        }
    }
});
