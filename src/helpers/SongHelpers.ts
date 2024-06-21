import { Asset } from "expo-media-library";
import { Track } from "react-native-track-player";
import * as MediaLibrary from "expo-media-library";
import { NativeModules } from "react-native";
const { GetAudioMetadata } = NativeModules;

export const createRepeatList = async (assets: Asset[]): Promise<Track[]> => {
  const songs: Track[] = [];
  for (const asset of assets) {
    const meta = await GetMeta(asset.uri);
    songs.push({
      title: meta.title || asset.filename.replace(".mp3", ""),
      url: asset.uri,
      artist: meta.artist
        ? meta.composer
          ? meta.composer
          : meta.artist
        : "Unknown Artist",
      album: meta.album || asset.albumId,
      id: asset.id,
      createdAt: meta.creationTime || asset.creationTime,
      genre: meta.genre || null,
      duration: meta.duration,
    });
  }

  return songs;
};

export const createShuffleList = (assets: Asset[]): Track[] => {
  const shuffled: Asset[] = [...assets];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.map((track: Asset, index: number) => {
    return {
      title: track.filename.replace(".mp3", ""),
      url: track.uri,
      artist: "Unknown Artist",
      album: track.albumId,
      id: index + 1,
    };
  });
};

export const reCreateShuffleList = (tracks: Track[]): Track[] => {
  const shuffled: Track[] = [...tracks];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const reCreateRepeatList = (tracks: Track[]): Track[] => {
  return tracks.sort((a: Track, b: Track) => a.id - b.id);
};

export async function getAllAudioFiles(): Promise<Asset[]> {
  let allAudioFiles = [];
  let hasNextPage = true;
  let endCursor: any = null;
  do {
    const result = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      first: 20,
      after: endCursor,
    });
    allAudioFiles.push(...result.assets);
    endCursor = result.endCursor;
    hasNextPage = result.hasNextPage;
  } while (hasNextPage);
  const validSongs = allAudioFiles.filter((track: Asset) => {
    return track.duration > 30;
  });
  return validSongs;
}

const GetMeta = async (path: string) => {
  const result = await GetAudioMetadata.getAudioMetadata(path)
    .then((r: any) => {
      return r;
    })
    .catch((e: any) => {
      return null;
    });

  return result;
};
