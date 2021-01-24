console.log("dans le navigateur")

const socket = new WebSocket(`ws://${window.location.hostname}:${window.location.port}`);

socket.addEventListener("message", async function (event) {
    try {
        const data = await event.data.text()
        console.log("message from server: ", data)
    } catch(err) {
        console.log(event.data)
    }
})

socket.addEventListener('open', function (event) {
    console.log("connected")
});

const input1 = document.querySelector('#subject1')
const input2 = document.querySelector('#subject2')
document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault()
    const data = JSON.stringify([ input1.value, input2.value ])
    socket.send(data)
})
