const toggleBtn = document.getElementById("toggleStart");
const video = document.getElementById("vidBox");
let recordings = document.getElementById("recording");
let flag = true;

let chunks = [];

function record() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((videoStream) => {
      let medRec = new MediaRecorder(videoStream);
      window.mediaStream = videoStream;
      window.mediaRecorder = medRec;
      medRec.start();

      medRec.addEventListener("dataavailable", (e) => {
        chunks.push(e.data);
      });

      medRec.addEventListener("stop", (e) => {
        let blob = new Blob(chunks, {
          type: "video/mp4",
        });
        chunks = [];
        let newVideo = document.createElement("video");
        newVideo.controls = "true";
        let url = URL.createObjectURL(blob);
        newVideo.src = url;
        recordings.append(newVideo);
      });

      video.srcObject = videoStream;
    });
}

toggleBtn.addEventListener("click", () => {
  if (flag) {
    record();
    flag = false;
  } else {
    window.mediaRecorder.stop();
    window.mediaStream.getTracks().forEach((track) => {
      track.stop();
    });
    flag = true;
  }
});
