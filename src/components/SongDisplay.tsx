import { useContext, useEffect, useState } from "react";
import { View, Text, Image, Pressable, Dimensions } from "react-native";
import { AppContext } from "../../App";
import ArtistPlaceholder from "../../assets/icons/music-solid.svg";
import { usePlaybackState } from "react-native-track-player";

const screenWidth = Dimensions.get("window").width;

export default function SongDisplay(props: any) {
  const { color, currentSong, playerHelpers }: any = useContext(AppContext);
  const { song, from, playlist } = props;
  const [location, setLocation] = useState<any>(
    playerHelpers.getPlayingLocation()
  );
  useEffect(() => {
    setLocation(playerHelpers.getPlayingLocation());
  }, [currentSong]);

  const handleSongPress = async () => {
    console.warn(song, song.id);
    await playerHelpers.playTrack(
      song.id,
      from ? from : null,
      playlist ? playlist : null
    );
    const loc = playerHelpers.getPlayingLocation();
    if (
      loc.playingOn !== location.playingOn ||
      location.playingPlaylist.id !== loc.playingPlaylist.id
    ) {
      setLocation(loc);
    }
  };

  const isSameLocation = () => {
    if (from && location.playingOn) {
      if (
        playlist &&
        location.playingPlaylist &&
        playlist.id === location.playingPlaylist.id
      )
        return true;
      else if (from === location.playingOn && from === "songs") return true;
      else false;
    } else return true;
  };

  return (
    <Pressable
      android_ripple={{ color: color.accent }}
      style={(pressed) => [{ opacity: pressed ? 0.8 : 1 }]}
      onPress={handleSongPress}
      onLongPress={props.onDragging}
    >
      <View
        style={{
          minHeight: 64,
          flexDirection: "row",
          paddingHorizontal: 28,
          paddingVertical: 5,
          display: "flex",
          backgroundColor:
            currentSong && currentSong?.id === song.id && isSameLocation()
              ? color.secondary
              : color.primary,
        }}
      >
        {song.artwork ? (
          <Image
            source={{ uri: song.artWork }}
            style={{ maxHeight: 64, maxWidth: 64 }}
          />
        ) : (
          <ArtistPlaceholder
            width={56}
            height={56}
            fill={
              currentSong && currentSong.id === song.id && isSameLocation()
                ? color.accent
                : color.secondary
            }
          />
        )}

        <View
          style={{ marginLeft: 16, display: "flex", flexDirection: "column" }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: color.text,
              fontWeight: "700",
              overflow: "hidden",
              fontSize: 16,
              marginTop: 5,
              zIndex: 0,
            }}
          >
            {song.artist || "Unknown Artist"}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              color: color.text,
              fontSize: 14,
              opacity: 0.6,
              marginTop: 6,
              width: screenWidth - 114,
            }}
          >
            {song.title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
