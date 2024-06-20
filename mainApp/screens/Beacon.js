import React, { useEffect, useState } from "react";
import { View, Text, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import Button from "../components/Button";
import app from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import { BleManager } from "react-native-ble-plx";

const bleManager = new BleManager();

const Beacon = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const auth = getAuth(app);

  useEffect(() => {
    if(isScanning){
      startScan();
    } else {
      stopScan();
    }
  }, [isScanning])

  const startScan = () => {
    bleManager.start({showAlert: false});

    bleManager.scan([], 5, true).then(res => {
      console.log('Scanning...', res)
    })
    .catch(err => {
      console.log('Error: ', err)
    })
  }

  const stopScan = () => {
    bleManager.stopScan()
      .then(() => {
        console.log('Scan stopped');
      })
      .catch((err) => {
        console.log('Error stopping scan: ', err);
      });
  };

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

  const toggleScan = () => {
    setIsScanning(prev => !prev)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View
        style={{
          flex: 1,
          marginHorizontal: 22,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginVertical: 12,
          }}
        >
          Welcome User!!
        </Text>
      </View>
      <View style={{flex: 1, marginLeft: 20}}>
        <Text style={{ fontWeight: "bold" }}>Moving Beacons: </Text>
      </View>

      <View style={{flex: 1, marginLeft: 20}}>
        <Text style={{ fontWeight: "bold" }}>Fixed Beacons: </Text>
      </View>

      <View style={{ flex: 1, bottom: 50, top: 50, marginHorizontal: 40 }}>
        <Button
          title={isScanning ? "Stop Scanning" : "Scan for Beacons"}
        />
      </View>

      <View style={{ marginBottom: 20, marginHorizontal: 20 }}>
        <Button title="Logout" onPress={Logout} />
      </View>
    </SafeAreaView>
  );
};

export default Beacon;
