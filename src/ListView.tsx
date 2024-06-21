import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { View, Text, Dimensions, Pressable } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import TrackPlayer, {
  State,
  usePlaybackState,
} from "react-native-track-player";
import { useFocusEffect } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LoadingScreen from "./components/Loading";
import BackIcon from "../assets/icons/chevron-left-solid.svg";
const phoneDimensions = Dimensions.get("window");

export default function VirtualListView({ navigation }: { navigation: any }) {
  const { color, currentSong, playerHelpers, setShowFooter }: any =
    useContext(AppContext);
  const [songList, setSongList] = useState([] as any);
  const playBackState = usePlaybackState();

  useEffect(() => {
    (async () => {
      const currQueue = await TrackPlayer.getQueue();
      const currPlayingIndex = await TrackPlayer.getCurrentTrack();
      const displaySongsList = currQueue.filter(
        (_: any, index: number) => index > (currPlayingIndex || 0)
      );
      setSongList(displaySongsList);
    })();
    return () => {};
  }, [currentSong]);

  useFocusEffect(() => {
    setShowFooter(true);
  });

  const onDragEnd = async ({ data }: any) => {
    setSongList(data);

    const currTrack: any = await TrackPlayer.getCurrentTrack();
    const tracks: any = await TrackPlayer.getQueue();
    const tracksToRemove: any = tracks.length - (currTrack + 1);
    let promises: any;
    for (let i = 0; i < tracksToRemove; i++)
      promises = TrackPlayer.remove(currTrack + 1);
    await Promise.all(promises);
    await TrackPlayer.add(data);
    if (playBackState === State.Playing) await TrackPlayer.play();
  };

  const renderingItem = ({ item, drag, isActive }: any) => (
    <ScaleDecorator activeScale={1.03}>
      <Pressable
        android_ripple={{ color: color.secondary }}
        style={{
          marginVertical: 2,
          paddingVertical: 4,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          shadowOpacity: 1,
          paddingLeft: 20,
        }}
        onLongPress={drag}
      >
        <View style={{ width: phoneDimensions.width - 50 }}>
          <Text style={{ fontSize: 18, color: color.text }} numberOfLines={1}>
            {item.artist}
          </Text>
          <Text numberOfLines={1} style={{ color: color.text, opacity: 0.8 }}>
            {item.title}
          </Text>
        </View>
      </Pressable>
    </ScaleDecorator>
  );

  if (!songList) return;

  return (
    <View style={{ backgroundColor: color.primary, flex: 1 }}>
      <View style={{ paddingLeft: 20, paddingTop: 10, paddingBottom: 5 }}>
        <BackIcon
          width={18}
          height={18}
          fill={color.text}
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
            else navigation.navigate("playing");
          }}
        />
        <Text
          style={{
            marginTop: 10,
            color: color.text,
            fontWeight: "600",
            fontSize: 18,
          }}
        >
          Up Next :
        </Text>
      </View>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DraggableFlatList
          ListEmptyComponent={<LoadingScreen transparent={true} />}
          initialNumToRender={songList.length}
          data={songList}
          renderItem={renderingItem}
          keyExtractor={(item: any) => item.id}
          onDragEnd={onDragEnd}
        />
      </GestureHandlerRootView>
    </View>
  );
}
