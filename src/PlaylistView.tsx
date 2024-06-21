import { useContext, useEffect, useState } from "react";
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Pressable,
  FlatList,
  BackHandler,
} from "react-native";
import { AppContext } from "../App";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import BackIcon from "../assets/icons/chevron-left-solid.svg";
import PlaylistArt from "../assets/icons/music-solid.svg";
import LoadingScreen from "./components/Loading";
import PlayIcon from "../assets/icons/play-solid.svg";
import AddIcon from "../assets/icons/plus-solid.svg";
import CheckIcon from "../assets/icons/check-solid.svg";
import PauseIcon from "../assets/icons/pause-solid.svg";
import SongDisplay from "./components/SongDisplay";
import { updatePlaylistSongs } from "./helpers/AppHelpers";
import TrackPlayer, {
  State,
  usePlaybackState,
} from "react-native-track-player";

const { width, height } = Dimensions.get("window");
const PLAY_CIRCLE_WIDTH = 75;

export default function PlaylistView({ navigation }: { navigation: any }) {
  const route = useRoute();
  const {
    color,
    playlists,
    setShowFooter,
    playerHelpers,
    setPlaylists,
    playType,
    setPlayType,
  }: any = useContext(AppContext);
  const [playlist, setPlaylist] = useState<any>();
  const [addSong, setAddSong] = useState<boolean>(false);
  const [songs, setSongs] = useState<any>();
  const [playlistSongs, setPlaylistSongs] = useState<any[]>();
  const [playing, setPlaying] = useState<boolean>();
  const playerState = usePlaybackState();

  useEffect(() => {
    if (playlists && playlists.length > 0) {
      const currPlaylist = playlists.filter(
        (item: any) => item.id === (route.params as any).playlist
      );
      setPlaylist(currPlaylist[0]);
      if (currPlaylist[0].songs && currPlaylist[0].songs.length > 0) {
        setPlaylistSongs(currPlaylist[0].songs);
        playerHelpers
          .getSongList(currPlaylist[0].songs)
          .then((r: any) => setSongs(r.sort((a: any, b: any) => a.id - b.id)));
      }
    }
    const location = playerHelpers.getPlayingLocation();

    if (
      location.playingOn === "playlist" &&
      playlist &&
      location.playingPlaylist.id === playlist.id &&
      (playerState === State.Playing || playerState === State.Buffering)
    ) {
      setPlaying(true);
    } else setPlaying(false);
  }, [playlists]);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBack);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBack);
    };
  }, []);

  useEffect(() => {
    const location = playerHelpers.getPlayingLocation();

    if (
      playerState === State.Playing &&
      playlist &&
      location.playingPlaylist &&
      playlist.id === location.playingPlaylist.id
    )
      setPlaying(true);
    else setPlaying(false);
  }, [playerState]);

  useFocusEffect(() => {
    if (addSong) setShowFooter(false);
    else setShowFooter(true);
  });

  const handleBack = () => {
    if (addSong) setAddSong(false);
    else if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate("playlist");
    return true;
  };

  const addNewSongsToPlaylist = async () => {
    setPlaylist({ ...playlist, songs: playlistSongs });
    const tracks = await playerHelpers.getSongList(playlistSongs);
    setSongs(tracks);
    setAddSong(false);
    const index = playlists.findIndex((list: any) => list.id === playlist.id);
    const temp = playlists;
    temp[index].songs = playlistSongs;
    setPlaylists(temp);
    await updatePlaylistSongs(playlistSongs as any, playlist.id);
  };

  const handlePlay = async () => {
    const location = playerHelpers.getPlayingLocation();
    if (
      location.playingPlaylist &&
      location.playingPlaylist.id !== playlist.id
    ) {
      await playerHelpers.playTrack(songs[0].id, "playlist", playlist);
      setPlaying(true);
    } else if (
      location.playingPlaylist &&
      location.playingPlaylist.id === playlist.id
    ) {
      if (playing) {
        await TrackPlayer.pause();
        setPlaying(false);
      } else {
        await TrackPlayer.play();
        setPlaying(true);
      }
    }
  };

  if (!playlist) return <LoadingScreen />;
  return (
    <View style={{ backgroundColor: color.primary, flex: 1 }}>
      <View
        style={{
          backgroundColor: color.secondary,
          width: "100%",
          height: height * 0.2,
          padding: 15,
        }}
      >
        <TouchableOpacity onPress={handleBack}>
          <BackIcon width={16} height={16} fill={color.text} />
        </TouchableOpacity>
        <View
          style={{
            marginTop: 15,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              backgroundColor: color.primary,
              height: 90,
              width: 90,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: color.accent,
              borderRadius: 3,
            }}
          >
            <PlaylistArt height={50} width={50} fill={color.accent} />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              justifyContent: "center",
              marginHorizontal: 40,
            }}
          >
            <Text
              style={{
                color: color.text,
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              {playlist.name}
            </Text>
            <Text style={{ color: color.text, fontSize: 14, opacity: 0.8 }}>
              {playlist.songs ? playlist.songs.length : 0} songs
            </Text>
          </View>
        </View>
      </View>
      <Pressable
        android_ripple={{
          color: color.accent,
          borderless: false,
          radius: PLAY_CIRCLE_WIDTH / 2,
        }}
        onPress={() => (addSong ? addNewSongsToPlaylist() : handlePlay())}
        style={{
          position: "absolute",
          top: width * 0.21 + PLAY_CIRCLE_WIDTH / 2,
          left: width - PLAY_CIRCLE_WIDTH - 15,
          width: PLAY_CIRCLE_WIDTH,
          height: PLAY_CIRCLE_WIDTH,
          backgroundColor: color.accent,
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
          opacity: 0.8,
          zIndex: 2,
        }}
      >
        {addSong ? (
          <CheckIcon width={24} height={24} fill={color.text} />
        ) : playing ? (
          <PauseIcon width={24} height={24} fill={color.text} />
        ) : (
          <PlayIcon width={24} height={24} fill={color.text} />
        )}
      </Pressable>
      {!addSong && (
        <FlatList
          data={songs}
          ListEmptyComponent={<Text>Nothing</Text>}
          renderItem={({ item }: any) => (
            <SongDisplay song={item} playlist={playlist} from="playlist" />
          )}
        />
      )}

      {addSong ? (
        <AddSongsToPlaylist
          setAddSong={setAddSong}
          currentPlaylistSongs={playlist.songs}
          setPlaylistSongs={setPlaylistSongs}
        />
      ) : (
        <Pressable
          onPress={() => setAddSong(true)}
          android_ripple={{
            color: color.secondary,
            radius: PLAY_CIRCLE_WIDTH / 2,
          }}
          style={{
            opacity: 0.8,
            position: "absolute",
            bottom: 16,
            right: 16,
            backgroundColor: color.secondary,
            width: PLAY_CIRCLE_WIDTH,
            height: PLAY_CIRCLE_WIDTH,
            borderRadius: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AddIcon width={24} height={24} fill={color.text} />
        </Pressable>
      )}
    </View>
  );
}

const AddSongsToPlaylist = ({
  setAddSong,
  currentPlaylistSongs,
  setPlaylistSongs,
}: {
  setAddSong: any;
  currentPlaylistSongs: any;
  setPlaylistSongs: any;
}) => {
  const { playerHelpers, color }: any = useContext(AppContext);
  const [songs, setSongs] = useState();
  const [addingSong, setAddingSong] = useState<any[]>(currentPlaylistSongs);
  useEffect(() => {
    (async () => {
      const songList = await playerHelpers.getSongList();
      setSongs(songList);
    })();
  }, []);
  const addToPlaylist = (item: any) => {
    const index = addingSong
      ? addingSong.findIndex((song: any) => song === item.id)
      : -1;
    let temp = [...(addingSong || [])];
    if (index === -1) {
      temp.push(item.id);
    } else {
      temp.splice(index, 1);
    }
    temp.sort((a: any, b: any) => a - b);
    setAddSong(temp);
    setAddingSong(temp);
    setPlaylistSongs(temp);
  };

  const isSongSelected = (id: any) => {
    const res = addingSong && addingSong.some((item: any) => id === item);
    return res;
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.primary, marginTop: 3 }}>
      <FlatList
        data={songs}
        extraData={addingSong}
        ListEmptyComponent={<LoadingScreen transparent={true} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => addToPlaylist(item)}
            android_ripple={{ color: color.accent }}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              display: "flex",
              justifyContent: "center",
              marginVertical: 3,
              ...style(color, isSongSelected(item.id)),
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {item.artist}
            </Text>
            <Text numberOfLines={1}>{item.title}</Text>
          </Pressable>
        )}
      />
      <TouchableOpacity onPress={() => setAddSong(false)}>
        <Text>go back</Text>
      </TouchableOpacity>
    </View>
  );
};

const style = (color: any, isSelected: boolean) => {
  if (isSelected)
    return {
      backgroundColor: color.secondary,
      borderLeftWidth: 4,
      borderColor: color.accent,
    };
  else
    return {
      backgroundColor: color.primary,
    };
};
