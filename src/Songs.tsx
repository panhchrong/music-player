import { useContext, useEffect, useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { AppContext } from "../App";
import SongDisplay from "./components/SongDisplay";
import IconRepeat from "../assets/icons/repeat-solid.svg";
import IconShuffle from "../assets/icons/shuffle-solid.svg";
import { useFocusEffect } from "@react-navigation/native";

export default function SongsList() {
  const {
    color,
    playType,
    setShowFooter,
    setPlayType,
    playerHelpers,
    search,
  }: any = useContext(AppContext);
  const [songs, setSongs] = useState([] as any);

  useEffect(() => {
    (async () => {
      const list = await playerHelpers.getSongList();
      setSongs(list);
    })();
  }, []);

  useFocusEffect(() => {
    setShowFooter(true);
  });

  const handleChangePlayType = async () => {
    if (playType === "repeat") {
      await playerHelpers.setPlayTypeShuffle();
      setPlayType("shuffle");
    } else {
      await playerHelpers.setPlayTypeRepeat();
      setPlayType("repeat");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: color.primary }}>
        <View
          style={{
            flex: 1,
            rowGap: 10,
            paddingTop: 10,
          }}
        >
          {songs &&
            songs.length > 0 &&
            songs
              .filter((song: any) =>
                song.title.toLowerCase().includes(search.toLowerCase())
              )
              .map((song: any) => (
                <SongDisplay key={song.id} song={song} from="songs" />
              ))}
        </View>
      </ScrollView>
      <Pressable
        android_ripple={{ color: color.primary, radius: 50 }}
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
        onPress={() => handleChangePlayType()}
      >
        {playType === "repeat" ? (
          <IconShuffle width={32} height={32} fill={color.text} />
        ) : (
          <IconRepeat width={32} height={32} fill={color.text} />
        )}
      </Pressable>
    </View>
  );
}
