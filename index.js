/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from "react-native-track-player";
import { DeviceEventEmitter, Platform } from "react-native";

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => require("./PlayerService"));
TrackPlayer.setupPlayer({ waitForBuffer: true }).then(() => {
  TrackPlayer.updateOptions({
    android: {
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },
    capabilities: [
      Capability.Pause,
      Capability.Play,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],
    compactCapabilities: [
      Capability.Pause,
      Capability.Play,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],
  });
});

if (Platform.OS === "android") {
  DeviceEventEmitter.addListener("mediaButton", (event) => {
    switch (event) {
      case "play":
        TrackPlayer.play();
        break;
      case "pause":
        TrackPlayer.pause();
        break;
      case "next":
        TrackPlayer.skipToNext();
        break;
      case "previous":
        TrackPlayer.skipToPrevious();
        break;
    }
  });
}
