import React from "react";
import { View, ActivityIndicator, StyleSheet, Appearance } from "react-native";

const color = Appearance.getColorScheme();

const LoadingScreen = ({ transparent }: { transparent?: boolean }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: transparent
          ? "transparent"
          : color === "dark"
          ? "#000000"
          : "#ffffff",
      }}
    >
      <ActivityIndicator
        size="large"
        color={color === "dark" ? "#ffffff" : "#000000"}
      />
    </View>
  );
};

export default LoadingScreen;
