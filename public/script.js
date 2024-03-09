const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const peer = new Peer();

const myvideo = document.createElement('video');
myvideo.muted = true;


navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {
console.log('primero');

    console.log(stream, 'propio');
     addVideoStream(myvideo, stream);
     peer.on('call', function (call){// answer the call
        console.log('te estoy respondiendo');
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', uservideoStream => {
            addVideoStream(video, uservideoStream);
        })
     })
     socket.on('user-connected', (userId) => {
        console.log('llega nuevo usuario');
        conectToNewUser(userId, stream);
     });
     
     
});


peer.on('open', id => {// Every Peer object is assigned a random, unique ID when it's created.
    console.log(id,'peer');
    socket.emit('join-room', ROOM_ID, id);
})
// socket.on('user-connected', userId => {
//     console.log('user-connected', userId);
// })



function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}

function conectToNewUser(userId, stream) {
    setTimeout(() => {
        console.log('viene el id del entrante', userId);
        const call = peer.call(userId, stream); //Call a peer, providing our mediaStream
        console.log(call, 'llamada');
        const video = document.createElement('video');
        call.on('stream', uservideoStream => { // `stream` is the MediaStream of the remote peer.
            try {
                console.log('media stream del remoto');
                addVideoStream(video,uservideoStream);
                
            } catch (error) {
                console.log(error,'error');
            }
        })
        call.on('close', () => {
            video.remove();
        })
    }, 2000);
    
        
}