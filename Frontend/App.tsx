// File: App.tsx
// Description: This file contains the main entry point of the application.
// Developed by: [Sakshith Reddy]
// Copyright 2024 

import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Welcome, Login, Signup, Beacon, Strategies } from "./screens";

const Stack = createNativeStackNavigator();

// Function: App
// Description: Main component representing the application.
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Beacon">
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Beacon"
          component={Beacon}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Strategies"
          component={Strategies}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}