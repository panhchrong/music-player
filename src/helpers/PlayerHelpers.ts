import { Asset } from "expo-media-library";
import TrackPlayer, { State, Track } from "react-native-track-player";
import {
  createRepeatList,
  createShuffleList,
  reCreateRepeatList,
  reCreateShuffleList,
} from "./SongHelpers";
import { IPlaylist } from "./AppHelpers";

export function usePlayerHelpers(songList: Asset[]): PlayerHelpers {
  let playType: "repeat" | "shuffle" = "repeat";
  let originalList: any[];
  let playingOn: string = "songs";
  let playingPlaylist: IPlaylist | null;

  const initialized = async () => {
    await TrackPlayer.reset();
    originalList = await createRepeatList(songList);
    await TrackPlayer.add(originalList);
  };
  const getQueue = async (): Promise<Track[] | null> => {
    return await TrackPlayer.getQueue();
  };
  const getSongList = async (idFilter?: string[]): Promise<Track[] | null> => {
    if (idFilter && idFilter.length > 0) {
      const result = [];
      for (const id of idFilter) {
        const res = originalList.find((song: any) => song.id === id);
        result.push(res);
      }
      return result;
    }
    return originalList;
  };
  const skipNext = async (): Promise<Track | null> => {
    const state = await TrackPlayer.getState();
    await TrackPlayer.skipToNext();
    if (state === State.Paused || state === State.Ready)
      await TrackPlayer.pause();
    const currIndex = await TrackPlayer.getCurrentTrack();
    const songs = await TrackPlayer.getQueue();
    if (songs && currIndex) return songs[currIndex];
    return null;
  };
  const skipPrev = async (): Promise<Track | null> => {
    const state = await TrackPlayer.getState();
    await TrackPlayer.skipToPrevious();
    if (state === State.Paused || state === State.Ready)
      await TrackPlayer.pause();
    const currIndex = await TrackPlayer.getCurrentTrack();
    const songs = await TrackPlayer.getQueue();
    if (songs && currIndex) return songs[currIndex];
    return null;
  };
  const playTrack = async (
    trackId: number | string,
    from?: string,
    playlist?: any
  ): Promise<Track | null> => {
    if (from !== "list") playingOn = from || "songs";
    if (from === "playlist") {
      if (!playingPlaylist || playlist.id !== playingPlaylist.id) {
        playingPlaylist = playlist;
        const list: any = await getSongList(playingPlaylist?.songs);
        const queueList =
          playType === "repeat"
            ? reCreateRepeatList(list)
            : reCreateShuffleList(list);
        await TrackPlayer.reset();
        await TrackPlayer.add(queueList);
      }
    } else if (from === "songs") {
      const list: any = await getSongList();
      const queueList: any =
        playType === "repeat"
          ? reCreateRepeatList(list)
          : reCreateShuffleList(list);
      await TrackPlayer.reset();
      await TrackPlayer.add(queueList);
      playingPlaylist = null;
    }

    const songs = await getQueue();
    const index: any = songs?.findIndex((track: Track) => track.id === trackId);
    await TrackPlayer.skip(index);
    await TrackPlayer.play();
    if (songs) return songs[index];
    else return null;
  };
  const getCurrentTrack = async (): Promise<Track | null> => {
    const songs = await getQueue();
    const currSongIndex = await TrackPlayer.getCurrentTrack();
    if (currSongIndex !== null && songs) return songs[currSongIndex];
    else return null;
  };
  const getSeekPosition = async (): Promise<number> => {
    const duration = await TrackPlayer.getDuration();
    const currPos = await TrackPlayer.getPosition();
    if (duration && currPos) return currPos / duration;
    else return 0;
  };
  const setSeekPosition = async (pos: number) => {
    const duration = await TrackPlayer.getDuration();
    const posToTime = pos * duration;
    await TrackPlayer.seekTo(posToTime);
  };
  const setPlayTypeRepeat = async () => {
    if (playType === "repeat") return;

    playType = "repeat";
  };
  const setPlayTypeShuffle = async () => {
    const currentSong = await TrackPlayer.getCurrentTrack();
    if (playType === "shuffle" || currentSong === null) return;
    const queue = await TrackPlayer.getQueue();
    if (queue !== null && queue.length > 0) {
      const length = queue.length - currentSong;
      if (currentSong > 0)
        for (let i = 0; i < currentSong; i++) await TrackPlayer.remove(0);
      for (let i = 0; i < length; i++) await TrackPlayer.remove(1);
    }
    const newShuffleList = reCreateShuffleList(queue);
    await TrackPlayer.add(newShuffleList);
    await TrackPlayer.play();
    playType = "shuffle";
  };
  let oldState: State | null = null;
  const onPlayerStateUpdate = async (callback: (state: State) => void) => {
    const status = await TrackPlayer.getState();
    if (oldState !== status) {
      oldState = status;
      callback(status);
    }
  };
  const manuallySetLocation = (from?: string, playlist?: IPlaylist | null) => {
    playingOn = from || playingOn;
    playingPlaylist = playlist || playingPlaylist;
    return { playingOn, playingPlaylist };
  };
  const getPlayingLocation = () => {
    return { playingOn, playingPlaylist };
  };
  const updateUpNextQueue = async (songs: Track[]): Promise<Track[]> => {
    await TrackPlayer.removeUpcomingTracks();
    await TrackPlayer.add(songs);
    return songs;
  };

  return {
    initialized,
    getQueue,
    getSongList,
    skipNext,
    skipPrev,
    playTrack,
    getCurrentTrack,
    getSeekPosition,
    setSeekPosition,
    onPlayerStateUpdate,
    setPlayTypeRepeat,
    setPlayTypeShuffle,
    getPlayingLocation,
    manuallySetLocation,
    updateUpNextQueue,
  };
}

export interface PlayerHelpers {
  initialized: () => Promise<void>;
  getQueue: () => Promise<Track[] | null>;
  getSongList: () => Promise<Track[] | null>;
  skipNext: () => Promise<Track | null>;
  skipPrev: () => Promise<Track | null>;
  playTrack: (trackId: number | string) => Promise<Track | null>;
  getCurrentTrack: () => Promise<Track | null>;
  getSeekPosition: () => Promise<number>;
  setSeekPosition: (pos: number) => void;
  onPlayerStateUpdate: (callback: (state: State) => void) => Promise<void>;
  setPlayTypeRepeat: () => Promise<void>;
  setPlayTypeShuffle: () => Promise<void>;
  getPlayingLocation: () => any;
  manuallySetLocation: (
    from?: string,
    playlist?: IPlaylist | null
  ) => { playingOn: string | null; playingPlaylist: IPlaylist | null };
  updateUpNextQueue: (songs: Track[]) => Promise<Track[]>;
}
