import { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../App";
import {
  Pressable,
  TouchableOpacity,
  View,
  Dimensions,
  Text,
} from "react-native";
import ChevronDown from "../assets/icons/chevron-down-solid.svg";
import ArtistPlaceholder from "../assets/icons/music-solid.svg";
import TextTicker from "react-native-text-ticker";
import Seeker from "./components/Seeker";
import IconPlay from "../assets/icons/play-solid.svg";
import IconBack from "../assets/icons/backward-step-solid.svg";
import IconForward from "../assets/icons/forward-step-solid.svg";
import IconRepeat from "../assets/icons/repeat-solid.svg";
import IconShuffle from "../assets/icons/shuffle-solid.svg";
import IconPause from "../assets/icons/pause-solid.svg";
import IconList from "../assets/icons/list-ul.svg";
import TrackPlayer, {
  State,
  usePlaybackState,
} from "react-native-track-player";
import { useFocusEffect } from "@react-navigation/native";

const phoneWidth = Dimensions.get("window").width;

export default function PlayingSong({ navigation }: { navigation: any }) {
  const {
    color,
    setShowFooter,
    playType,
    playerHelpers,
    setPlayType,
    currentSong,
  }: any = useContext(AppContext);

  const [paused, setPaused] = useState<boolean>();
  const playBackState = usePlaybackState();
  const [location, setLocation] = useState<any>();

  useEffect(() => {
    setPaused(playBackState !== State.Playing);
  }, [playBackState]);

  useFocusEffect(() => {
    setShowFooter(false);
  });

  useEffect(() => {
    setLocation(playerHelpers.getPlayingLocation());
  }, [currentSong]);

  const handlePausePlayMusic = async () => {
    if (paused) await TrackPlayer.play();
    else await TrackPlayer.pause();
  };

  const handleNext = async () => {
    await playerHelpers.skipNext();
  };
  const handlePrev = async () => {
    await playerHelpers.skipPrev();
  };

  const handleNavigateToHome = () => {
    navigation.goBack();
  };

  const handlePlayType = async () => {
    if (playType === "repeat") {
      await playerHelpers.setPlayTypeShuffle();
      setPlayType("shuffle");
    } else {
      await playerHelpers.setPlayTypeRepeat();
      setPlayType("repeat");
    }
  };

  const createPlayingOnTextFormat = () => {
    if (location && location.playingOn && location.playingOn === "playlist")
      return location.playingPlaylist.name;
    else return "songs";
  };

  return (
    <View
      style={{ backgroundColor: color.primary, flex: 1, paddingHorizontal: 15 }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: "4%",
          paddingHorizontal: "5%",
        }}
      >
        <TouchableOpacity onPress={handleNavigateToHome}>
          <ChevronDown width={18} height={18} fill={color.text} />
        </TouchableOpacity>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={{ color: color.text }}>Playing on </Text>
          <Text style={{ color: color.text, fontWeight: "bold" }}>
            {createPlayingOnTextFormat()}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("list")}>
          <IconList width={18} height={18} fill={color.text} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginTop: "5%",
          backgroundColor: color.secondary,
          borderWidth: 1,
          borderColor: color.secondary,
          marginHorizontal: "5%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ArtistPlaceholder width="100%" height="50%" fill={color.accent} />
      </View>
      <View
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          paddingHorizontal: "auto",
          justifyContent: "center",
          marginVertical: "9%",
        }}
      >
        <TextTicker
          scrollSpeed={20}
          repeatSpacer={50}
          marqueeDelay={0}
          useNativeDriver={true}
          style={{
            width: phoneWidth - 50,
            color: color.text,
            fontSize: 24,
            fontWeight: "bold",
          }}
          loop
        >
          {currentSong?.artist || "Unknown Artist"} - {currentSong?.title}
        </TextTicker>
      </View>
      <Seeker />
      <View
        style={{
          marginTop: "10%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          height: "auto",
          width: "100%",
          paddingHorizontal: "10%",
        }}
      >
        <TouchableOpacity onPress={() => handlePlayType()}>
          <IconRepeat
            width={19}
            height={19}
            fill={playType === "repeat" ? color.accent : color.text}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: "12%" }} onPress={handlePrev}>
          <IconBack width={28} height={28} fill={color.text} />
        </TouchableOpacity>
        <Pressable
          android_ripple={{ color: color.primary, radius: 50 }}
          style={{
            borderRadius: 50,
            backgroundColor: color.secondary,
            padding: 28,
            marginHorizontal: "10%",
          }}
          onPress={handlePausePlayMusic}
        >
          {paused ? (
            <IconPlay width={28} height={28} fill={color.text} />
          ) : (
            <IconPause width={28} height={28} fill={color.text} />
          )}
        </Pressable>
        <TouchableOpacity style={{ marginRight: "12%" }} onPress={handleNext}>
          <IconForward width={28} height={28} fill={color.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePlayType()}>
          <IconShuffle
            width={19}
            height={19}
            fill={playType === "shuffle" ? color.accent : color.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
