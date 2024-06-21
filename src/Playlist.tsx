import { useContext, useEffect, useState } from "react";
import {
  View,
  Dimensions,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { AppContext } from "../App";
import AddIcon from "../assets/icons/plus-solid.svg";
import MusicIcon from "../assets/icons/music-solid.svg";
import TextTicker from "react-native-text-ticker";
import { useFocusEffect } from "@react-navigation/native";

const phoneWidth = Dimensions.get("window").width;
const phoneHeight = Dimensions.get("window").height;

export default function Playlist({ navigation }: { navigation: any }) {
  const { color, setShowFooter, setPlaylistRegister, playlists }: any =
    useContext(AppContext);

  useFocusEffect(() => {
    setShowFooter(true);
  });

  const addExamplePlaylist = () => {
    setPlaylistRegister(true);
  };

  const goToPlaylistView = (item: any) => {
    navigation.navigate("playlist-view", { playlist: item.id });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.primary,
        paddingHorizontal: 10,
        paddingTop: 10,
      }}
    >
      <FlatList
        data={playlists}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              width: phoneWidth / 2 - 40,
              height: phoneHeight / 4,
              margin: 15,
              backgroundColor: color.secondary,
              borderWidth: 2,
              borderColor: color.accent,
              borderRadius: 5,
            }}
            onPress={() => goToPlaylistView(item)}
          >
            <View
              style={{
                backgroundColor: color.primary,
                height: "70%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MusicIcon height={70} width={70} fill={color.accent} />
            </View>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: "10%",
                paddingHorizontal: "10%",
              }}
            >
              <TextTicker
                style={{
                  fontSize: 20,
                  color: color.text,
                  fontWeight: "bold",
                }}
                loop
                scrollSpeed={20}
              >
                {item.name}
              </TextTicker>
            </View>
          </TouchableOpacity>
        )}
      />
      <Pressable
        android_ripple={{ color: color.primary, radius: 50 }}
        onPress={addExamplePlaylist}
        style={(pressed) => [
          {
            opacity: pressed ? 0.8 : 1,
            position: "absolute",
            bottom: 16,
            right: 16,
            backgroundColor: color.secondary,
            padding: 30,
            borderRadius: 50,
          },
        ]}
      >
        <AddIcon width={32} height={32} fill={color.text} />
      </Pressable>
    </View>
  );
}
