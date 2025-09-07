import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import User from "../pages/user";
import Settings from "../pages/settings";
import CustomTabBar from "../components/CustomTabBar";

const Tab = createBottomTabNavigator();

export default function BottomRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="User" component={User} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}
