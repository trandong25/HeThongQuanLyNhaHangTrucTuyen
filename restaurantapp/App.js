import { useContext, useReducer } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from 'react-native-paper';
import Home from "./screens/Home/Home";
import Search from "./screens/Search/Search";
import Cart from "./screens/Cart/Cart";
import Chat from "./screens/Chat/Chat";
import Profile from "./screens/User/Profile";
import Login from "./screens/User/Login";
import Register from "./screens/User/Register";
import { MyUserContext } from "./configs/Contexts";
import { MyUserReducer } from "./reducers/UserReducer";
import { StackScreen } from "react-native-screens";
import FoodDetail from "./screens/Home/FoodDetail";

const Stack = createNativeStackNavigator(); 
const Tab = createBottomTabNavigator();

const HomeStackNavigator = () =>{
  return(
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" component={Home}/>
      <Stack.Screen name="food-detail" component={FoodDetail} 
                  options={{ headerShown:true ,title:"Chi tiết món ăn"}} />
    </Stack.Navigator>
  )
}
const AuthStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
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
      <Tab.Screen name="Trang chủ" component={HomeStackNavigator} options={{ tabBarIcon: ({color}) => <Icon source="home" size={26} color={color} />}}/>
      <Tab.Screen name="Tìm kiếm" component={Search} options={{ tabBarIcon: ({color}) => <Icon source="magnify" size={26} color={color}/>}}/>
      <Tab.Screen name="Giỏ hàng" component={Cart} options={{ tabBarIcon: ({color}) => <Icon source="cart" size={26} color={color} />}} />

      {user === null ? (
        <Tab.Screen 
          name="Tài khoản" 
          component={AuthStackNavigator} 
          options={{
            title: 'Tài khoản', 
            tabBarIcon: ({color}) => <Icon source="account" size={30} color={color} />
          }} 
        />
      ) : (
        <>
          <Tab.Screen name="Chat" component={Chat} options={{ tabBarIcon: ({color}) => <Icon source="chat" size={26} color={color} />}} />
          <Tab.Screen name="Tài khoản" component={Profile} options={{title: 'Thông tin', tabBarIcon: ({color}) => <Icon source="account-check" size={30} color={color} />}} />
        </>
      )}
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <NavigationContainer>
        <TabNavigator/>
      </NavigationContainer>
    </MyUserContext.Provider>
  );
}
