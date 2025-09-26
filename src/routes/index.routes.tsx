import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import type { RootStackParamList } from "./types";
import { supabase } from "../lib/supabase";
import type { Session } from "@supabase/supabase-js";

import Login from "../pages/login";
import SignUp from "../pages/signup";
import BottomRoutes from "./bottom.routes";
import LogToday from "../pages/log";
import DayWorkouts from "../pages/day";

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_e, s) => {
      if (mounted) setSession(s);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (session === undefined) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <>
          <Stack.Screen
            name="BottomRoutes"
            component={BottomRoutes}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LogToday"
            component={LogToday}
            options={{
              headerShown: true,
              title: "Workout Log",
            }}
          />
          <Stack.Screen
            name="DayWorkouts"
            component={DayWorkouts}
            options={{
              headerShown: true,
              title: "Workouts",
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </>
      )}
    </Stack.Navigator>
  );
}
