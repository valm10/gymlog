import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import User from "../pages/user";
import Settings from "../pages/settings";

const Tab = createBottomTabNavigator();

export default function BottomRoutes() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="User" component={User} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}
