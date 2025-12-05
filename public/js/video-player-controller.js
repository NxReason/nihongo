const VideoPlayerController = {
  init() {
    VideoPlayer.setVideoUpdateCallback(syncSubs);
    SubsList.setSubClickCallback(syncVideo);
  },
};

VideoPlayerController.init();

function syncVideo(ts) {
  VideoPlayer.setCurrentTime(ts);
}
function syncSubs() {}
