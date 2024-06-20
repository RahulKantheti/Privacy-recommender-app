// File: Welcome.tsx
// Description: This file contains the Welcome component, which displays the welcome screen of the application.
// Developed by: [Keethi Pendyala, Wasim Syed]
// Copyright 2024 

import React from "react";
import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "../constants/Colors";
import Button from "../components/Button";


// Function: Welcome
// Description: React component for displaying the welcome screen of the application.
// Arguments:
//   - navigation: Navigation prop used for navigating between screens.
const Welcome = ({ navigation }: { navigation: any }) => {
  return (
    <LinearGradient
      style={{
        flex: 1,
      }}
      colors={[COLORS.secondary, COLORS.primary]}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingHorizontal: 22,
            position: "absolute",
            top: 400,
            width: "100%",
          }}
        >
          <Text
            style={{
              fontSize: 35,
              fontWeight: "400",
              color: COLORS.white,
            }}
          >
            Privacy Recommendation
          </Text>
          <Text
            style={{
              fontSize: 46,
              fontWeight: "800",
              color: COLORS.white,
            }}
          >
            Team 27
          </Text>
          <Button
            title="Sign Up"
            onPress={() => navigation.navigate("Signup")}
            style={{
              marginTop: 22,
              width: "100%",
            }}
          />
          <View
            style={{
              flexDirection: "row",
              marginTop: 12,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: COLORS.white,
              }}
            >
              Already have an account?
            </Text>
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginLeft: 10,
                  color: COLORS.grey,
                }}
              >
                Login
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Welcome;
