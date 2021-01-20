console.log("dans le navigateur")

const socket = new WebSocket(`ws://${window.location.hostname}:${window.location.port}`);

socket.addEventListener("message", async function (event) {

    try {
        const data = await event.data.text()
        console.log("message from server: ", data)
    } catch(err) {

    }

})

socket.addEventListener('open', function (event) {
    console.log("connected", event)
});

const input1 = document.querySelector('#subject1')
document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault()
    socket.send(input1.value)
})
