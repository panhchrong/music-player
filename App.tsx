import { NavigationContainer, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, useColorScheme, StatusBar, View } from "react-native";
import { useEffect, useState, createContext, useRef } from "react";
import AppHeader from "./src/components/AppHeader";
import AppFooter from "./src/components/AppFooter";
import Seeker from "./src/components/Seeker";
import PlayingSong from "./src/PlayingSong";
import VirtualListView from "./src/ListView";
import { usePlayerHelpers, PlayerHelpers } from "./src/helpers/PlayerHelpers";
import * as MediaLibrary from "expo-media-library";
import TrackPlayer, {
  Event,
  State,
  Track,
  useTrackPlayerEvents,
} from "react-native-track-player";
import LoadingScreen from "./src/components/Loading";
import Search from "./src/components/Search";
import SideMenu from "./src/components/SideMenu";
import SongsList from "./src/Songs";
import { getAllAudioFiles } from "./src/helpers/SongHelpers";
import Playlist from "./src/Playlist";
import { getAppSetting } from "./src/helpers/AppHelpers";
import CreatePlaylistModal from "./src/components/CreatePlaylistModal";
import PlaylistView from "./src/PlaylistView";

const Stack = createNativeStackNavigator();

const Theme = {
  dark: {
    primary: "#1a1c22",
    secondary: "#292b36",
    accent: "#00A3AD",
    text: "#ffffff",
  },
  light: {
    primary: "#EFF2F7",
    secondary: "#E4E7F1",
    accent: "#cec1d9",
    text: "#000000",
  },
};

const events = [
  Event.PlaybackError,
  Event.PlaybackTrackChanged,
  Event.RemoteSkip,
];

export const AppContext = createContext(null);

export default function App() {
  const [showFooter, setShowFooter] = useState(true);
  const [currentSong, setCurrentSong] = useState<Track>();
  const [color, setColor] = useState<any>();
  const [playerHelpers, setPlayerHelpers] = useState<PlayerHelpers>();
  const phoneTheme = useColorScheme();
  const [playType, setPlayType] = useState("repeat");
  const navigation = useRef({} as any);
  const [searching, setSearching] = useState<boolean>();
  const [search, setSearch] = useState<string>("");
  const [currentTrackId, setCurrentTrackId] = useState<any>(null);
  const [showSideMenu, setShowSideMenu] = useState<boolean>(false);
  const [setting, setSetting] = useState<any>();
  const [playlistRegister, setPlaylistRegister] = useState<boolean>(false);
  const [playlists, setPlaylists] = useState<
    { id: string; name: string; songs: string[] }[]
  >([]);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      let tempSetting;

      if (status === "granted") {
        const media = await getAllAudioFiles();
        const helpers = usePlayerHelpers(media);
        await helpers.initialized();
        setPlayerHelpers(helpers);
        tempSetting = await getAppSetting();
        setSetting(tempSetting);
      }
      if (tempSetting.theme === "auto")
        setColor(phoneTheme === "dark" ? Theme.dark : Theme.light);
      else
        setColor(
          tempSetting.theme === "dark"
            ? setColor(Theme.dark)
            : setColor(Theme.light)
        );
      if (tempSetting.playlist.length > 0) {
        setPlaylists(tempSetting.playlist);
      }
    })();

    return () => {
      (async () => {
        await TrackPlayer.reset();
      })();
    };
  }, []);

  useEffect(() => {
    if (phoneTheme === "dark") setColor(Theme.dark);
    else setColor(Theme.light);
  }, [phoneTheme]);

  useTrackPlayerEvents(events, async (event) => {
    if (event.type === Event.PlaybackError) {
      await TrackPlayer.reset();
    }
    if (event.type === Event.PlaybackTrackChanged && playerHelpers) {
      const curr: any = await playerHelpers.getCurrentTrack();
      setCurrentSong(curr);
      setCurrentTrackId(event.nextTrack);
    }
    console.log(event);
  });

  if (!color || !playerHelpers) return <LoadingScreen />;

  return (
    <AppContext.Provider
      value={
        {
          color,
          playType,
          setPlayType,
          showFooter,
          setShowFooter,
          playerHelpers,
          currentSong,
          setCurrentSong,
          searching,
          setSearching,
          search,
          setSearch,
          showSideMenu,
          setShowSideMenu,
          setting,
          playlistRegister,
          setPlaylistRegister,
          playlists,
          setPlaylists,
        } as any
      }
    >
      <SafeAreaView
        edges={["top", "bottom", "left", "right"]}
        style={{
          flex: 1,
          backgroundColor: color.primary,
        }}
      >
        <View style={{ zIndex: 5 }}>
          <StatusBar
            translucent={true}
            backgroundColor={color.primary}
            barStyle={phoneTheme === "dark" ? "light-content" : "dark-content"}
          />
        </View>
        {showSideMenu && <SideMenu navigation={navigation.current} />}
        <NavigationContainer ref={navigation}>
          <Stack.Navigator
            screenOptions={{
              header: (props) => <AppHeader {...props} />,
              animation: "fade_from_bottom",
              animationDuration: 50,
            }}
          >
            <Stack.Screen name="songs" component={SongsList} />
            <Stack.Screen name="playing" component={PlayingSong} />
            <Stack.Screen name="list" component={VirtualListView} />
            <Stack.Screen name="playlist" component={Playlist} />
            <Stack.Screen name="playlist-view" component={PlaylistView} />
          </Stack.Navigator>
        </NavigationContainer>
        {playlistRegister && <CreatePlaylistModal />}
        {showFooter && !searching && (
          <>
            <Seeker />
            <AppFooter navigation={navigation} />
          </>
        )}
      </SafeAreaView>
    </AppContext.Provider>
  );
}
