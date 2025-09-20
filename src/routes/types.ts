export type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
    BottomRoutes: undefined;
    LogToday: undefined;
  };
  export type RootTabParamList = {
    Home: undefined;
    User: undefined;
    Settings: undefined;
  };
  
  // File: src/components/CustomTabBar/index.tsx
  import React, { useState } from "react";
  import {
    ActivityIndicator,
    TouchableOpacity,
    View,
    Text,
    Platform,
  } from "react-native";
  import { useSafeAreaInsets } from "react-native-safe-area-context";
  import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
  import {
    Ionicons,
    MaterialIcons,
    FontAwesome5,
    Feather,
  } from "@expo/vector-icons";
  import { styles } from "./style";
  import theme from "../../global/themes";
  import { startWorkout } from "../../services/db";
  
  export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const [creating, setCreating] = useState(false);
  
    const onPressTab = (routeName: string) =>
      navigation.navigate(routeName as never);
  
    const onStartWorkout = async () => {
      if (creating) return;
      try {
        setCreating(true);
        await startWorkout();
        navigation.navigate("LogToday" as never);
      } finally {
        setCreating(false);
      }
    };
  
    const iconFor = (name: string, focused: boolean) => {
      const color = focused ? theme.colors.primary : "rgba(0,0,0,0.35)";
      const size = 22;
      switch (name) {
        case "Home":
          return <Feather name="calendar" size={size} color={color} />;
        case "User":
          return <FontAwesome5 name="user" size={size} color={color} />;
        case "Settings":
          return <Feather name="settings" size={size} color={color} />;
        default:
          return <Ionicons name="ellipse" size={size} color={color} />;
      }
    };
  
    return (
      <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <View style={styles.tabArea}>
          {state.routes.map((route, i) => {
            const focused = state.index === i;
            return (
              <TouchableOpacity
                key={route.key}
                style={styles.tabItem}
                onPress={() => onPressTab(route.name)}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={route.name}
              >
                {iconFor(route.name, focused)}
                <Text style={[styles.tabLabel, focused && styles.tabLabelFocus]}>
                  {route.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
  
        <TouchableOpacity
          style={styles.fab}
          onPress={onStartWorkout}
          disabled={creating}
          accessibilityRole="button"
          accessibilityLabel="Start workout"
        >
          {creating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="add" size={28} color="#fff" />
              <MaterialIcons
                name="edit-note"
                size={24}
                color="#fff"
                style={{ marginLeft: 4, marginTop: 2 }}
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  }