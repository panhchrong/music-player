import { useContext, useRef, useEffect, useState } from "react";
import {
  View,
  Animated,
  Pressable,
  TouchableOpacity,
  VirtualizedList,
} from "react-native";
import { AppContext } from "../../App";
import TextTicker from "react-native-text-ticker";
import IconPlay from "../../assets/icons/play-solid.svg";
import IconPause from "../../assets/icons/pause-solid.svg";
import IconForward from "../../assets/icons/forward-step-solid.svg";
import IconBackward from "../../assets/icons/backward-step-solid.svg";
import TrackPlayer, {
  State,
  usePlaybackState,
} from "react-native-track-player";

export default function AppFooter({ navigation }: { navigation: any }) {
  const { color, currentSong, playerHelpers }: any = useContext(AppContext);
  const height = useRef(new Animated.Value(0)).current;
  const [paused, setPaused] = useState<boolean>();
  const playBackState = usePlaybackState();

  useEffect(() => {
    if (currentSong) {
      Animated.timing(height, {
        toValue: 60,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(height, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [currentSong]);

  useEffect(() => {
    setPaused(playBackState !== State.Playing);
  }, [playBackState]);

  const handleNavigateToPlaying = () => {
    navigation.current.navigate("playing");
  };

  const handlePauseMusic = async () => {
    await TrackPlayer.pause();
  };

  const handleContinue = async () => {
    await TrackPlayer.play();
  };

  const handleNext = async () => {
    await playerHelpers.skipNext();
  };
  const handlePrev = async () => {
    await playerHelpers.skipPrev();
  };

  if (!currentSong) return;

  return (
    <Pressable
      onPress={handleNavigateToPlaying}
      android_ripple={{ color: color.accent }}
    >
      <Animated.View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 28,
          flexDirection: "row",
          minHeight: height,
        }}
      >
        <TextTicker
          scrollSpeed={20}
          style={{ color: color.text, width: 220, fontSize: 14 }}
          loop
        >
          {currentSong?.artist || "Unknown Artist"} - {currentSong?.title}
        </TextTicker>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <TouchableOpacity onPress={handlePrev}>
            <IconBackward width={20} height={20} fill={color.text} />
          </TouchableOpacity>
          {paused && (
            <TouchableOpacity
              style={{ marginHorizontal: 12 }}
              onPress={handleContinue}
            >
              <IconPlay width={19} height={19} fill={color.text} />
            </TouchableOpacity>
          )}
          {!paused && (
            <TouchableOpacity
              style={{ marginHorizontal: 12 }}
              onPress={handlePauseMusic}
            >
              <IconPause width={20} height={20} fill={color.text} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleNext}>
            <IconForward width={20} height={20} fill={color.text} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Pressable>
  );
}
