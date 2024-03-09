const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const peer = new Peer(undefined, {
    host: '/',
    port: 3001,
});

const myvideo = document.createElement('video');
myvideo.muted = true;

if(USER === 'admin') {
    navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
    }).then(stream => {
    console.log('primero');
    
         addVideoStream(myvideo, stream);
         peer.on('call', function (call){// answer the call
            call.answer(stream);
            const video = document.createElement('video');
            call.on('stream', uservideoStream => {
                console.log('del otro', uservideoStream);
                addVideoStream(video, uservideoStream);
            })
         })
         socket.on('user-connected', (userId) => {
            console.log('llega nuevo usuario');
            conectToNewUser(userId, stream);
         });
         
         
    });
}
else {
    peer.on('call', function (call){// answer the call
        console.log('llega la llamada del admin');
        call.answer();
        const video = document.createElement('video');
        call.on('stream', uservideoStream => {
            console.log('del otro', uservideoStream);
            addVideoStream(video, uservideoStream);
        })
     })
}


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
        call.on('close', () => {
        })
    }, 8000);
    
        
}