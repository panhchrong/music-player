import { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  TextInputProps,
} from "react-native";
import { AppContext } from "../../App";
import CloseIcon from "../../assets/icons/xmark-solid.svg";
import ConfirmIcon from "../../assets/icons/check-solid.svg";
import { addNewPlaylist } from "../helpers/AppHelpers";

const { width, height } = Dimensions.get("window");

export default function CreatePlaylistModal() {
  const { color, setPlaylistRegister, playlists, setPlaylists }: any =
    useContext(AppContext);
  const [name, setName] = useState<string>(
    `Playlist #${playlists.length > 0 ? playlists.length + 1 : 1}`
  );
  const inputRef = useRef<any>();

  useEffect(() => {}, []);

  const onTextInput = (value: string) => {
    setName(value);
  };

  const createPlaylist = async () => {
    if (!name) return;
    const playlist = await addNewPlaylist({ name });
    setPlaylists(playlist);
    setPlaylistRegister(false);
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.5,
          backgroundColor: color.secondary,
          zIndex: 3,
        }}
      />
      <View
        style={{
          flex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 4,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: color.primary,
            width: width / 1.3,
            height: height / 5.4,
            paddingHorizontal: 20,
            borderWidth: 2,
            borderColor: color.accent,
            borderRadius: 10,
          }}
        >
          <View
            style={{
              marginTop: 20,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: color.text,
                fontWeight: "600",
              }}
            >
              Playlist name:
            </Text>
            <TouchableOpacity onPress={() => setPlaylistRegister(false)}>
              <CloseIcon width={20} height={20} fill={color.accent} />
            </TouchableOpacity>
          </View>
          <TextInput
            ref={inputRef}
            numberOfLines={1}
            onChangeText={onTextInput}
            defaultValue={name}
            autoFocus={true}
            style={{
              borderBottomWidth: 2,
              borderColor: color.accent,
              backgroundColor: color.secondary,
              fontSize: 15,
              marginTop: "7%",
              paddingTop: 0,
              paddingBottom: 0,
            }}
          />
          <TouchableOpacity
            style={{
              marginTop: "6%",
              display: "flex",
              alignItems: "flex-end",
            }}
            onPress={createPlaylist}
          >
            <ConfirmIcon width={20} height={20} fill={color.accent} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
