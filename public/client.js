let username

window.onload = () => {

    username = prompt('username-ul tau : ')
    
    while(username.length >= 20){
        username = prompt('username-ul tau (maxim 20 caractere) ')
    }

    let socket = io();
    const form = document.getElementById('form')
    const inputVal = document.getElementById('message');
    const fileInputVal = document.getElementById('photo')

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = inputVal.value;
        //console.log(fileInputVal.files.length);
        if(fileInputVal.files) { //daca avem imagini incarcate
            getBase64(fileInputVal.files[0]).then( (data) => {
                socket.emit('message-image', data)
            })
        }
        socket.emit('message', message)
        inputVal.value = ''
        fileInputVal.value = ''
    })

    socket.on('msgFromserver', (msg) => {
        const container = document.createElement('div')
        container.innerText = msg
        document.getElementById('messages').appendChild(container);
    })

    socket.on('imageFromServer', (base64image) => {
        const receivedImage = document.createElement('img')
        receivedImage.src = 'data:image/png;base64'
        receivedImage.src += base64image
        receivedImage.width = 300
        receivedImage.height = 150
        console.log(base64image)
        document.getElementById('messages').appendChild(receivedImage)
    })

    socket.emit('gotUsername', username)
}


function getBase64(image) {
    return new Promise( (resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(image)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (err) => reject(err)
    })
}