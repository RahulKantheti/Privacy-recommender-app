// File: Beacon.ts
// Description: This file contains a custom React Hook for managing Bluetooth Low Energy (BLE) functionality in a React Native application.
// Developed by: [Sakshith Reddy, Vidit Sanghvi, Keerthi Pendyala]
// Copyright 2024 


import React, { useEffect, useState } from "react";
import { View, Text, Platform, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import COLORS from "../constants/Colors";
import Button from "../components/Button";
import useBLE from "../useBLE";
import { getAuth } from "firebase/auth";
import app from "../firebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getjdata } from "./constants";
import { Card } from "@rneui/themed";
import Checkbox from 'expo-checkbox';
import { LinearGradient } from "expo-linear-gradient";
import { setSharedValue } from "./constants";



// Function: Beacon
// Description: React component for displaying sensor information and managing BLE functionality.
// Navigation: Navigation prop used for navigating between screens.

const Beacon = ({ navigation }: { navigation: any }) => {
  const auth = getAuth(app);
  
  // State to store sensor data and moving status
  const [dataf, setDataf] = useState<Record<string, any>>([])

  const [isSelected, setIsSelected] = useState(false)
 // Function to handle user logout
//  Arguments: None
  setSharedValue(isSelected);
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
 // Function to trigger BLE scanning for devices
 //  Arguments: None
  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };
 // Retrieve BLE functions from custom hook
  const { requestPermissions, scanForPeripherals } = useBLE();

 // Function to refresh sensor data
 //  Arguments: None
  const openModal = async () => {
    console.log("Pressd reload")
    await scanForDevices();
    setDataf(getjdata());
    
  
    
  };
 // Effect to update sensor data periodically
 //  Arguments: None
 //  Refreshes every 4 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDataf(getjdata());
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);
 
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          marginBottom: 10,
          backgroundColor: COLORS.primary
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
        <Pressable onPress={openModal}>
          <Ionicons
            name="reload-outline"
            color={COLORS.white}
            size={25}
            style={{ right: 15 }}
          />
        </Pressable>
      </View>
      <View style={{
          marginHorizontal: 20,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
          backgroundColor: COLORS.primary
        }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10}}>
          <Text style={{ fontWeight: "bold", fontSize: 15, color: COLORS.white }}>Moving Status</Text>
          <Checkbox value={isSelected} onValueChange={setIsSelected} style={{ borderRadius: 3, height: 23, width: 23}} color={isSelected ? COLORS.black : COLORS.white} />
        </View>
        <Pressable
            style={styles.button_1}
            onPress={() => navigation.navigate("Strategies", {data : dataf})}
          >
            <Text style={{ fontSize: 18, color: COLORS.white }}>
              Go to Strategies
            </Text>
          </Pressable>
      </View>
      <View
        style={{
          marginHorizontal: 20,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 15, left: 5, color: COLORS.white }}>Filter by Category</Text>
        <Pressable style={{ alignItems: "center" }}>
          <Ionicons name="eye-outline" size={25} color={COLORS.white}/>
          <Text style={{ fontWeight: "bold", color: COLORS.white }}>Video</Text>
        </Pressable>
        <Pressable style={{ alignItems: "center", right: 5 }}>
          <Ionicons name="mic-outline" size={25} color={COLORS.white} />
          <Text style={{ fontWeight: "bold", color: COLORS.white }}>Audio</Text>
        </Pressable>
      </View>
      <ScrollView>
      {
        dataf === undefined ? 
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>No sensors found</Text> : 
          dataf["sensors_in_range"] === undefined ? (
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>Sensing...</Text>
          ) : (
          <>
            {dataf["sensors_in_range"].map((item : Record<string, any>) => (
              <Card key={item.sensor_id} containerStyle={{ borderRadius: 12, borderColor: COLORS.black }}>
                <View
                  style={{
                    flex: 0.7,
                    marginLeft: 15,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    Sensor name:{" "}
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>{item.sensor_name}</Text>
                  {item.sensor_info.sensor_capabilities.length == 2 && (
                    <>
                      <Ionicons
                        name="eye-outline"
                        size={15}
                        style={{ marginRight: 20, fontWeight: "bold" }}
                      />
                      <Ionicons
                        name="mic-outline"
                        size={15}
                        style={{ marginRight: 20, fontWeight: "bold" }}
                      />
                    </>
                  )}
                  {item.sensor_info.sensor_capabilities.includes("Audio") &&
                    item.sensor_info.sensor_capabilities.length == 1 && (
                      <Ionicons
                        name="mic-outline"
                        size={15}
                        style={{ marginRight: 20 }}
                      />
                    )}
                </View>
                <View style={{ flexDirection: "row", marginLeft: 20 }}>
                    <Text>Sensing Range: </Text>
                    <Text>{item.range}</Text>
                </View>
                <View style={{ flexDirection: "row", marginLeft: 20 }}>
                    <Text>Sensing Type: </Text>
                    <Text>{item.type == 1 ? 'Moving beacon' : 'Fixed beacon'}</Text>
                </View>
                <View style={{ flexDirection: "row", marginLeft: 20 }}>
                    <Text>Sensing Capability: </Text>
                    <Text>{item.sensor_info.sensor_capabilities.join('  ')}</Text>
                </View>
                <View style={{ flexDirection: "row", marginLeft: 20 }}>
                    <Text>Activation: </Text>
                    <Text>{item.sensor_info.activation}</Text>
                </View>
                <View style={{ flexDirection: "row", marginLeft: 20 }}>
                    <Text>Sensing Distance: </Text>
                    <Text>{item.sensor_info.sensing_range}</Text>
                </View>
              </Card>
            ))}
          </>
        )
      }
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

export default Beacon;

