// File: Login.tsx
// Description: This file contains the Login component, which allows users to log in to their accounts.
// Developed by: [Sakshith Reddy, Rahul Kantheti]
// Copyright 2024 

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/Colors";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";
import app from "../firebaseConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { setSharedValue } from "./constants";


// Function: Login
// Description: React component for user login functionality.
// Arguments:
//   - navigation: Navigation prop used for navigating between screens.

const Login = ({ navigation }: { navigation: any }) => {
   // State variables for email, password, and show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth(app);

// Function to handle user login
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log(email + " logged in!");
      // Navigate to Beacon screen after successful login
      navigation.navigate("Beacon");
    } catch (error) {
      // Alert user if login fails
      alert("Incorrect username or password");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, marginHorizontal: 22 }}>
        <Text
          style={{
            fontSize: 30,
            color: COLORS.black,
            marginVertical: 12,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Login to your account
        </Text>
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginVertical: 8,
            }}
          >
            Email Address
          </Text>
          <View
            style={{
              borderColor: COLORS.black,
              width: "100%",
              borderWidth: 1,
              borderRadius: 8,
              paddingLeft: 22,
              height: 48,
              justifyContent: "center",
            }}
          >
            <TextInput
              placeholder="Enter email address"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                width: "100%",
              }}
            />
          </View>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginVertical: 8,
            }}
          >
            Password
          </Text>
          <View
            style={{
              borderColor: COLORS.black,
              width: "100%",
              borderWidth: 1,
              borderRadius: 8,
              paddingLeft: 22,
              height: 48,
              justifyContent: "center",
            }}
          >
            <TextInput
              placeholder="Enter password"
              placeholderTextColor={COLORS.black}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(password) => setPassword(password)}
              style={{
                width: "100%",
              }}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 12,
              }}
            >
              {showPassword == false ? (
                <Ionicons name="eye-off" size={24} />
              ) : (
                <Ionicons name="eye" size={24} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <Button
          title="Login"
          filled
          onPress={handleLogin}
          style={{
            marginTop: 18,
            marginBottom: 4,
          }}
        />
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            marginTop: 8,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            New here?
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: COLORS.black,
              textAlign: "center",
            }}
          >
            Sign up and uncover the invisible eyes invading your personal space
          </Text>
          <Pressable
            onPress={() => navigation.navigate("Signup")}
            style={{
              marginLeft: 6,
              justifyContent: "center",
              alignItems: "center",
              top: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Login;
