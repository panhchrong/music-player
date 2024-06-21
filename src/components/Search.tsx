import { useContext, useEffect } from "react";
import { View } from "react-native";
import { Text } from "react-native-svg";
import { AppContext } from "../../App";

export default function Search() {
  const { setShowFooter, color }: any = useContext(AppContext);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.secondary,
      }}
    >
      <Text>Searching . . .</Text>
    </View>
  );
}
