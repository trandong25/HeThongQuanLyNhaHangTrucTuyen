import { useReducer } from "react";

import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./screens/User/Login";
import Register from "./screens/User/Register";

// Context
import { MyUserContext } from "./configs/Contexts";

// Reducer
import { MyUserReducer } from "./reducers/reducers";

const Stack = createNativeStackNavigator();

export default function App() {

    // Global state
    const [user, dispatch] = useReducer(
        MyUserReducer,
        null
    );

    return (

        // Provider
        <MyUserContext.Provider value={[user, dispatch]}>

            <NavigationContainer>

                <Stack.Navigator>

                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{ headerShown: false }}
                    />

                    <Stack.Screen
                        name="Register"
                        component={Register}
                        options={{ headerShown: false }}
                    />

                </Stack.Navigator>

            </NavigationContainer>

        </MyUserContext.Provider>
    );
}