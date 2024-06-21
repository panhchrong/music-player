import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppContext } from "../../App";

const SIDE_MENU_WIDTH = 45;
const OVERLAY_MENU_OPACITY = 0.5;
const MENU_OPACITY = 0.9;

function SideMenu({ navigation }: { navigation: any }) {
  const { color, showSideMenu, setShowSideMenu }: any = useContext(AppContext);
  const [currentRoute, setCurrentRoute] = useState<string>(
    navigation.getCurrentRoute().name
  );
  const sideMenuAnim = useRef(new Animated.Value(0)).current;
  const menuOpacity = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sideMenuWidth = sideMenuAnim.interpolate({
    inputRange: [0, SIDE_MENU_WIDTH],
    outputRange: ["0%", "45%"],
  });

  useEffect(() => {
    if (showSideMenu) {
      Animated.timing(sideMenuAnim, {
        toValue: SIDE_MENU_WIDTH,
        duration: 250,
        useNativeDriver: false,
      }).start();
      Animated.timing(overlayOpacity, {
        toValue: OVERLAY_MENU_OPACITY,
        duration: 250,
        useNativeDriver: false,
      }).start();
      Animated.timing(menuOpacity, {
        toValue: MENU_OPACITY,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }

    return () => {};
  }, [showSideMenu]);

  const closeSideMenu = () => {
    Animated.timing(sideMenuAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
    Animated.timing(menuOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setTimeout(() => setShowSideMenu(false), 250);
  };

  return (
    <>
      <Animated.View
        style={[
          styles.sideMenu,
          {
            backgroundColor: color.primary,
            width: sideMenuWidth,
            opacity: menuOpacity,
          },
        ]}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: color.text,
            overflow: "hidden",
          }}
        >
          Menu
        </Text>
        <View style={[styles.line, { backgroundColor: color.accent }]} />
        <NavItem
          navigation={navigation}
          navText="Songs"
          toRoute="songs"
          currentRoute={currentRoute}
          setCurrentRoute={setCurrentRoute}
        />
        <NavItem
          navigation={navigation}
          navText="Playing Song"
          toRoute="playing"
          currentRoute={currentRoute}
          setCurrentRoute={setCurrentRoute}
        />
        <NavItem
          navigation={navigation}
          navText="Playlists"
          toRoute="playlist"
          currentRoute={currentRoute}
          setCurrentRoute={setCurrentRoute}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.overlay,
          { opacity: overlayOpacity, backgroundColor: color.primary },
        ]}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
          }}
          onPress={closeSideMenu}
        />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  sideMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    zIndex: 3,
    paddingTop: "15%",
    paddingHorizontal: "8%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  line: {
    height: 2,
    width: "100%",
    marginVertical: "5%",
    borderRadius: 2,
  },
});

const NavItem = ({
  navigation,
  navText,
  toRoute,
  currentRoute,
  setCurrentRoute,
}: {
  navigation: any;
  navText?: string;
  toRoute: string;
  currentRoute: string;
  setCurrentRoute: any;
}) => {
  const { color }: any = useContext(AppContext);
  const handleNavigate = () => {
    navigation.navigate(toRoute);
    setCurrentRoute(toRoute);
  };
  return (
    <TouchableOpacity
      style={{
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 3,
        borderRightWidth: 4,
        borderColor: currentRoute === toRoute ? color.accent : "transparent",
        backgroundColor:
          currentRoute === toRoute ? color.secondary : color.primary,
      }}
      onPress={handleNavigate}
    >
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{ color: color.text }}
      >
        {navText}
      </Text>
    </TouchableOpacity>
  );
};

export default SideMenu;
