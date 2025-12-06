const videoPlayer = document.getElementById("video-player");
const videoUploadBtn = document.getElementById("video-upload-input");
let videoLoaded = false;

const VideoPlayer = {
  init() {
    videoPlayer.volume = 0.5;

    videoPlayer.addEventListener("loadedmetadata", () => {
      videoLoaded = true;
    });
  },

  setVideoUpdateCallback(fn) {
    videoPlayer.addEventListener("timeupdate", fn);
  },

  setVideo(url) {
    videoPlayer.src = url;
  },

  getCurrentTime() {
    if (!videoLoaded) {
      return 0;
    }

    return videoPlayer.currentTime;
  },
  setCurrentTime(ts) {
    if (!videoLoaded) {
      console.warn("No video loaded");
      return;
    }

    videoPlayer.currentTime = ts;
  },
};

VideoPlayer.init();
