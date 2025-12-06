const VideoPlayerController = {
  desync: 0,

  init() {
    VideoPlayer.setVideoUpdateCallback(syncSubs.bind(this));
    SubsList.setSubClickCallback(syncVideo.bind(this));

    Uploads.addVideoUploadCallback(setUploadedVideo);
    Uploads.addSubsUploadCallback(setUploadedSubs);

    Settings.addDesyncUpdate((sec) => {
      this.desync = sec;
    });
  },
};

VideoPlayerController.init();

function syncVideo(ts) {
  VideoPlayer.setCurrentTime(ts - this.desync);
}
function syncSubs() {
  // when video stopped clicking subs timestamp can sometimes
  // go to previous sub (? because of value returned from player)
  const floatingPointDesyncFix = 0.01;
  const ts = VideoPlayer.getCurrentTime();
  const sub = SubsList.findSubByTimestamp(
    ts + this.desync + floatingPointDesyncFix,
  );
  console.log(ts + this.desync + floatingPointDesyncFix);
  if (sub?.node) {
    SubsList.updateCurrent(sub.node);
  }
}

function setUploadedVideo(file) {
  const videoUrl = URL.createObjectURL(file);
  VideoPlayer.setVideo(videoUrl);
}

async function setUploadedSubs(file) {
  const text = await file.text();
  SubsList.set(text);
}
