import { View } from "react-native"
import Header from "./components/Header"
import Styles from "./styles/Styles";
import Home from "./screens/Home/Home";
import Search from "./screens/Search/Search";
import Cart from "./screens/Cart/Cart";
import Chat from "./screens/Chat/Chat";
import Profile from "./screens/User/Profile";
import Login from "./screens/User/Login";
import { SafeAreaView } from "react-native";
import { Icon, Provider as PaperProvider } from 'react-native-paper';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MyUserContext } from "./configs/Context";
import { MyUserReducer } from "./reducers/UserReducer";
import { useContext, useReducer } from "react";
import Register from "./screens/User/Register";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStackNavigator = () =>{
  return(
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name = "index" component={Home}/>
    </Stack.Navigator>
  )
}

const TabNavigator = () => {
  const [user, ] = useContext(MyUserContext);
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#E65100',
      tabBarInactiveTintColor: 'gray'
    }}>
      <Tab.Screen name ="Trang chủ" component={HomeStackNavigator} options={{ tabBarIcon: ({color}) => <Icon source="home" size={26} color={color} />}}/>
      <Tab.Screen name ="Tìm kiếm" component={Search} options={{ tabBarIcon: ({color}) => <Icon source="magnify" size={26} color={color}/>}}/>
      <Tab.Screen name ="Giỏ hàng" component={Cart} options={{ tabBarIcon: ({color}) => <Icon source="cart" size={26} color={color} />}} />

      {user == null ? <>
        <Tab.Screen name ="Đăng nhập" component={Login} options={{title: 'Đăng nhập', tabBarIcon: () => <Icon source="account" size={30} />}} />
        <Tab.Screen name ="Đăng ký" component={Register} options={{title: 'Đăng ký', tabBarIcon: () => <Icon source="account-plus" size={30} />}} />
      </>:<>
        <Tab.Screen name ="Chat" component={Chat} options={{ tabBarIcon: ({color}) => <Icon source="chat" size={26} color={color} />}} />
        <Tab.Screen name ="Tài khoản" component={Profile} options={{title: 'Thông tin', tabBarIcon: () => <Icon source="account" size={30} />}} />
      </>}
    </Tab.Navigator>
  );
}


const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null)
  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <NavigationContainer>
        <TabNavigator/>
      </NavigationContainer>
    </MyUserContext.Provider>
  );
}

export default App;