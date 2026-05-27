import { useContext, useReducer } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from 'react-native-paper';
import Home from "./screens/Home/Home";
import Search from "./screens/Search/SearchScreen";
import Cart from "./screens/Cart/Cart";
import Chat from "./screens/Chat/Chat";
import Profile from "./screens/User/Profile";
import Login from "./screens/User/Login";
import Register from "./screens/User/Register";
import { MyUserReducer } from "./reducers/UserReducer";
import { StackScreen } from "react-native-screens";
import FoodDetail from "./screens/Home/FoodDetail";
import { CartContext, MyUserContext } from "./configs/Contexts";
import { CartReducer } from "./reducers/CartReducer";
import Reservation from "./screens/Reservation/Reservation";
import Order from "./screens/Order/Order";
import ChefHome from "./screens/Chef/ChefHome";
import AddDish from "./screens/Chef/AddDish";
import Payment from "./screens/Payment/Payment";
import MyReservations from "./screens/Reservation/MyReservation";
import CompareScreen from "./screens/Home/CompareScreen";
import Review from "./screens/review/Review";
import ChefReviews from "./screens/Chef/ChefReviews";
import SearchScreen from "./screens/Search/SearchScreen";


const Stack = createNativeStackNavigator(); 
const Tab = createBottomTabNavigator();


const ChefTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#E65100',
      tabBarInactiveTintColor: 'gray'
    }}>
      <Tab.Screen
        name="Quản lý"
        component={ChefHome}
        options={{ tabBarIcon: ({color}) => <Icon source="food-fork-drink" size={26} color={color} />}}
      />
       <Tab.Screen
        name="Đánh giá"
        component={ChefReviews}
        options={{ tabBarIcon: ({color}) => <Icon source="star" size={26} color={color} />}}
      />
      <Tab.Screen
        name="Tài khoản"
        component={Profile}
        options={{ tabBarIcon: ({color}) => <Icon source="account-check" size={26} color={color} />}}
      />
    </Tab.Navigator>
  )
}

const ChefRootStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChefTabs" component={ChefTabNavigator} />
      <Stack.Screen name="AddDish" component={AddDish} options={{ headerShown: true, title: "Cập nhật món" }}/>
    </Stack.Navigator>
  );
}
const HomeStackNavigator = () =>{
  return(
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" component={Home}/>
      <Stack.Screen name="SearchScreen" component={SearchScreen}
                options={{ headerShown: true, title: "Tìm kiếm món ăn" }}/>
      <Stack.Screen name="food-detail" component={FoodDetail} 
                options={{ headerShown:true ,title:"Chi tiết món ăn"}} />
      <Stack.Screen name="compare" component={CompareScreen} 
                options={{ headerShown:true ,title:"So sánh món ăn"}} />
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
  const [user, ] = useContext(MyUserContext);

  if (user && user.role === 'CHEF') {
    return <ChefRootStack />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Order" component={Order} />
      <Stack.Screen name="Reservation" component={Reservation} />
      <Stack.Screen name="MyReservations" component={MyReservations} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="Review" component={Review}  />
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

