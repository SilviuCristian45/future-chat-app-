
let username

window.onload = () => {

    username = prompt('username-ul tau : ')
    
    while(username && username.length >= 20){
        username = prompt('username-ul tau (maxim 20 caractere) ')
    }

    document.getElementById('form').append(buildEmojiPicker())
    
    let socket = io();
    const form  = document.getElementById('form')
    const inputVal= document.getElementById('message');
    const fileInputVal  = document.getElementById('photo')
    inputVal.value = ''
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = inputVal.value;
        //console.log(fileInputVal.files.length);
        if(fileInputVal.files.length) { //daca avem imagini incarcate
            getBase64(fileInputVal.files[0]).then( (data) => {
                const type = data.split(';')[0].split('/')[1];
                if(type == 'png' || type == 'jpeg' || type == 'jpg'){
                    const container = document.createElement('img')
                    container.width = 300
                    container.height = 150
                    container.src = data
                    document.getElementById('messages').appendChild(container)
                }
                else {
                    const receivedVideo = document.createElement('video')
                    const receivedSource = document.createElement('source')
                    receivedSource.src = data
                    receivedVideo.width = 300
                    receivedVideo.height = 150
                    receivedVideo.appendChild(receivedSource)
                    receivedVideo.autoplay = false
                    receivedVideo.controls = true
                    document.getElementById('messages').appendChild(receivedVideo)
                }
                socket.emit('message-image', data)
            })
        }
        const container = document.createElement('div')
        container.innerText = username + ' : ' + message
        document.getElementById('messages').appendChild(container);

        socket.emit('message', username + ' : ' + message)
        inputVal.value = ''
        fileInputVal.value = ''
    })

    socket.on('msgFromserver', (msg) => {
        const container = document.createElement('div')
        container.innerText = msg
        document.getElementById('messages').appendChild(container);
    })

    socket.on('imageFromServer', (base64image) => {
        const type = base64image.split(';')[0].split('/')[1];
        console.log(` type received : ${type}`)

        if(type == 'jpeg' || type == 'png'){
            const receivedImage = document.createElement('img')
            receivedImage.src = 'data:image/png;base64'
            receivedImage.src += base64image
            receivedImage.width = 300
            receivedImage.height = 150
            document.getElementById('messages').appendChild(receivedImage)
        }

        if(type == 'mp4') {
            const receivedVideo = document.createElement('video')
            const receivedSource = document.createElement('source')
            receivedSource.src = base64image
            receivedVideo.width = 300
            receivedVideo.height = 150
            receivedVideo.controls = ''
            receivedVideo.appendChild(receivedSource)
            receivedVideo.autoplay = true
            receivedVideo.controls = true
            document.getElementById('messages').appendChild(receivedVideo)
        }
        
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

function buildEmojiPicker(){
    const picker = document.createElement('select')
    for(let i = 0; i < emoji.length; i++){
        const option = document.createElement('option')
        option.innerText = emoji[i]
        picker.appendChild(option)
    }
    picker.onchange = () => document.getElementById('message').value += picker.value
    return picker
}

