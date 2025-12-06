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
function syncSubs() {
  const ts = VideoPlayer.getCurrentTime();
  const sub = SubsList.findSubByTimestamp(ts);
  if (sub?.node) {
    SubsList.updateCurrent(sub.node);
  }
}
