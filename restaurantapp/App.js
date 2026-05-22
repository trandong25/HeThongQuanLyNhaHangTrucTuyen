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
import { CartContext, MyUserContext } from "./configs/Contexts";
import {MyUserReducer} from "./reducers/UserReducer";
import { CartReducer } from "./reducers/CartReducer";
import Reservation from "./screens/Reservation/Reservation";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStackNavigator = () =>{
  return(
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" component={Home}/>
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
  const [cart,] = useContext(CartContext);
  const cartCount = Object.values(cart).reduce((total, item)=> total+item.quantity, 0);

  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#E65100',
      tabBarInactiveTintColor: 'gray'
    }}>
      <Tab.Screen name="Home" component={HomeStackNavigator} options={{ tabBarIcon: ({color}) => <Icon source="home" size={26} color={color} />}}/>
      <Tab.Screen name="Search" component={Search} options={{ tabBarIcon: ({color}) => <Icon source="magnify" size={26} color={color}/>}}/>
      <Tab.Screen 
        name="Cart" component={Cart} 
        options={{ tabBarIcon: ({color}) => <Icon source="shopping-outline" size={26} color={color} />,
          tabBarBadge: cartCount > 0 ? cartCount: null
        }} 
      />

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

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      
      <Stack.Screen name="Reservation" component={Reservation} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, dispatchUser] = useReducer(MyUserReducer, null);
  const [cart, dispatchCart] = useReducer(CartReducer, {});

  return (
    <MyUserContext.Provider value={[user, dispatchUser]}>
      <CartContext.Provider value={[cart, dispatchCart]}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </CartContext.Provider>
    </MyUserContext.Provider>
  );
}