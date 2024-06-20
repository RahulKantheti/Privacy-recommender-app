// File: Strategies.tsx
// Description: This file contains the Strategies component, which displays strategies related to sensor data.
// Developed by: [Sakshith Reddy, Wasim Syed, Vidit Sanghvi]
// Copyright 2024 

import { Pressable, View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "../constants/Colors";
import Button from "../components/Button";
import { getAuth } from "firebase/auth";
import app from "../firebaseConfig";
import { Card } from "@rneui/base";
import { Colors } from "react-native/Libraries/NewAppScreen";

// Function: Strategies
// Description: React component for displaying strategies related to sensor data.
// Arguments:
//   - navigation: Navigation prop used for navigating between screens.
//   - route: Route prop used for passing data between screens.
const Strategies = ({ navigation, route }: { navigation: any, route: any }) => {
  const auth = getAuth(app);

// Extracting data from route parameters
  const { data } = route.params

 // Function to handle user logout
  const Logout = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((err) => {
        alert(err);
      });
  };

  // Using the extracted startegy data to display in front end
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Ionicons
          name="navigate-outline"
          color={COLORS.white}
          size={25}
          style={{ left: 15 }}
        />
        <Text
          style={{
            fontSize: 30,
            color: COLORS.white,
            fontWeight: "bold",
          }}
        >
          ASU Library
        </Text>
        <Pressable>
          <Ionicons
            name="reload-outline"
            color={COLORS.white}
            size={25}
            style={{ right: 15 }}
          />
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      ></View>
      <View
        style={{
          marginHorizontal: 20,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <Pressable style={{ alignItems: "center" }}>
          <Ionicons name="eye-outline" size={25} color={COLORS.white}/>
          <Text style={{ fontWeight: "bold", color: COLORS.white }}>Video</Text>
        </Pressable>
        <Pressable
          style={styles.button_1}
          onPress={() => navigation.navigate("Beacon")}
        >
          <Text style={{ fontSize: 18, color: COLORS.white }}>
            Go to Sensors
          </Text>
        </Pressable>
        <Pressable style={{ alignItems: "center" }}>
          <Ionicons name="mic-outline" size={25} color={COLORS.white}/>
          <Text style={{ fontWeight: "bold", color: COLORS.white }}>Audio</Text>
        </Pressable>
      </View>
      <ScrollView>
  {data["strategy_list"] ? (
    data["strategy_list"].map((item: Record<string, any>) => (
      <Card
        key={item.id}
        containerStyle={{ borderRadius: 12, borderColor: COLORS.black }}
      >
        <View
          style={{
            flex: 0.7,
            marginLeft: 15,
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
            }}
          >
            Message:{" "}
          </Text>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            {item.msg}
          </Text>
        </View>
        <View style={{ flexDirection: "row", marginLeft: 20 }}>
          <Text>User Status: </Text>
          <Text>{item.user_status}</Text>
        </View>
        <View style={{ flexDirection: "row", marginLeft: 20 }}>
          <Text>Sensor Type: </Text>
          <Text>{item.sensor_status}</Text>
        </View>
      </Card>
    ))
  ) : (
    <Text style={{ textAlign: "center", fontWeight: "bold" }}>No Sensors Found</Text>
  )}
  </ScrollView>
      <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
        <Button title="Logout" onPress={Logout} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button_1: {
    borderWidth: 2,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderColor: COLORS.white,
    paddingVertical: 5,
    width: "50%",
  },
});

export default Strategies;
