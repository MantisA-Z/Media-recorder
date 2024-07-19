const toggleBtn = document.getElementById('toggleStart');
const videoBox = document.getElementById('vidBox');
const recordings = document.getElementById('recording');

let flag = true;
let chunks = [];

function record(){
    navigator.mediaDevices.getUserMedia({
        video: true, 
        audio: true
    })
    .then((videoStream) => {
        let vidRecorder = new MediaRecorder(videoStream);
        window.MediaStream = videoStream;
        window.MediaRecorder = vidRecorder;
        vidRecorder.start();
        videoBox.srcObject = videoStream;

        vidRecorder.addEventListener('dataavailable', (e) => {
            chunks.push(e.data);
        })

        vidRecorder.addEventListener('stop', () => {
            let blob = new Blob(chunks, {
                type: 'video/mp4'
            });
            let newVideo = document.createElement('video');
            newVideo.controls = 'true';
            let url = URL.createObjectURL(blob);
            newVideo.src = url;
            recordings.appendChild(newVideo);
            chunks = [];
        })
    })
}

toggleBtn.addEventListener('click', () => {
    if(flag){
        record();
        flag = false;
    }else{
        window.MediaRecorder.stop();
        window.MediaStream.getTracks().forEach(track => {
            track.stop();
        });
        flag = true;
    }
})