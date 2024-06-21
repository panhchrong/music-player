import { useContext, useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, TextInput, BackHandler } from "react-native";
import { AppContext } from "../../App";
import Bars from "../../assets/icons/bars-solid.svg";
import Search from "../../assets/icons/magnifying-glass-solid.svg";
import Back from "../../assets/icons/chevron-left-solid.svg";
import { useNavigationState, useRoute } from "@react-navigation/native";

export default function AppHeader(props: any) {
  const { color, searching, setSearching, setShowSideMenu, setSearch }: any =
    useContext(AppContext);
  const route = useRoute();

  const handleStartSearch = () => {
    if (route.name !== "songs") {
      props.navigation.navigate("songs");
    }
    setSearching(true);
  };

  const handleInputSearch = (text: string) => {
    setSearch(text);
  };

  const handleBack = () => {
    setSearch("");
    setSearching(false);
  };

  return (
    <View
      style={{
        paddingVertical: 16,
        paddingHorizontal: 28,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 2,
        borderColor: color.secondary,
      }}
    >
      {searching ? (
        <TouchableOpacity onPress={handleBack}>
          <Back width={20} height={20} fill={color.text} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => setShowSideMenu(true)}>
          <Bars width={20} height={20} fill={color.text} />
        </TouchableOpacity>
      )}
      {searching && (
        <TextInput
          autoFocus={true}
          style={{
            fontSize: 14,
            paddingBottom: 0,
            paddingTop: 0,
            color: color.text,
            borderBottomWidth: 2,
            borderColor: color.accent,
            width: "70%",
          }}
          onChangeText={handleInputSearch}
        />
      )}
      <TouchableOpacity onPress={handleStartSearch}>
        <Search width={20} height={20} fill={color.text} />
      </TouchableOpacity>
    </View>
  );
}
