import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { RootTabParamList } from "./types";
import Home from "../pages/home";
import Settings from "../pages/settings";
import CustomTabBar from "../components/CustomTabBar";

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function BottomRoutes() {
  return (
    <Tab.Navigator
      detachInactiveScreens={true}
      screenOptions={{ headerShown: false }}
      tabBar={(p) => <CustomTabBar {...p} />}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}
