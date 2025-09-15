import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../pages/login";
import SignUp from "../pages/signup";
import BottomRoutes from "./bottom.routes";
import LogToday from "../pages/log";
import { supabase } from "../lib/supabase";
import type { RootStackParamList } from "./types";

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <>
          <Stack.Screen name="BottomRoutes" component={BottomRoutes} />
          <Stack.Screen name="LogToday" component={LogToday} />
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
