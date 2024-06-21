import RNFS from "react-native-fs";

const defaultSetting = {
  theme: "auto",
  playlist: [],
  artwork: [],
};
const appSettingPath = `${RNFS.DocumentDirectoryPath}/Meowsic.json`;

export async function getAppSetting() {
  const fileExists = await RNFS.exists(appSettingPath);
  if (fileExists) {
    const settingsString = await RNFS.readFile(appSettingPath, "utf8");
    return JSON.parse(settingsString);
  } else {
    await RNFS.writeFile(
      appSettingPath,
      JSON.stringify(defaultSetting),
      "utf8"
    );
    return defaultSetting;
  }
}

export async function addNewPlaylist(playlist: IPlaylist) {
  if (!playlist.id) playlist.id = generateUniqueId();
  if (!playlist.name) return null;
  const setting = await getAppSetting();
  if (setting.playlist.length > 0) {
    setting.playlist = [...setting.playlist, playlist];
  } else setting.playlist = [playlist];
  await RNFS.unlink(appSettingPath);
  await RNFS.writeFile(appSettingPath, JSON.stringify(setting), "utf8");
  return setting.playlist;
}

export async function updatePlaylistSongs(songs: any[], playlistId: string) {
  const setting = await getAppSetting();
  const index = setting.playlist.findIndex(
    (list: any) => list.id === playlistId
  );
  setting.playlist[index].songs = songs;
  await RNFS.unlink(appSettingPath);
  await RNFS.writeFile(appSettingPath, JSON.stringify(setting), "utf8");
}

export function generateUniqueId() {
  const key = (Math.random() * 10000).toString(16);
  return key;
}

export interface IPlaylist {
  id?: string;
  name: string;
  songs?: string[];
}
