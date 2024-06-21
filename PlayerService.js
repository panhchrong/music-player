import TrackPlayer from "react-native-track-player";
import { Event } from "react-native-track-player";

module.exports = async function () {
  // This service needs to be registered for the module to work
  // but it will be used later in the "Receiving Events" section
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());

  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());

  TrackPlayer.addEventListener(Event.RemoteNext, () =>
    TrackPlayer.skipToNext()
  );
  TrackPlayer.addEventListener(Event.RemotePrevious, () =>
    TrackPlayer.skipToPrevious()
  );
  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async () => {
    const queue = await TrackPlayer.getQueue();
    if (queue.length > 0) {
      await TrackPlayer.skip(0);
    }
  });
};
