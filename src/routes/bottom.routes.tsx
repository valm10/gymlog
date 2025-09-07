import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import User from "../pages/user";
import Settings from "../pages/settings";
import CustomTabBar from "../components/CustomTabBar";
import { AuthProviderList } from "../context/authContext_list";

const Tab = createBottomTabNavigator();

export default function BottomRoutes() {
  return (
    <AuthProviderList>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tab.Screen name="User" component={User} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </AuthProviderList>
  );
}
