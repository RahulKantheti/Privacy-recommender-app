// File: useBLE.ts
// Description: This file contains a custom React Hook for managing Bluetooth Low Energy (BLE) functionality in a React Native application.
// Developed by: [Vidit Sanghvi, Wasim Syed]
// Copyright 2024 


/* eslint-disable no-bitwise */
import { useMemo } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager } from "react-native-ble-plx";
import * as ExpoDevice from "expo-device";
import { getSharedValue, setjdata } from "./screens/constants";
import * as Device from 'expo-device';


// Interface: BluetoothLowEnergyApi
// Description: Interface defining the structure of the Bluetooth Low Energy API.
interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>; // Function for requesting BLE permissions
  scanForPeripherals(): void; // Function for scanning for BLE peripherals
}

// Function: useBLE
// Description: For managing bluetooth Low Energy functionality.
// Returns: BluetoothLowEnergyApi object
function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  let string1: string;
  const deviceNames: string[] = [];
  const rssiValues: number[] = [];
  const deviceIds: string[] = [];
  const deviceName = Device.deviceName;

//   Function: requestAndroid31Permissions
//   Description: Requests BLE permissions for Android API level 31 and below.
//   Returns: Promise<boolean> indicating if permissions were granted.
  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      },
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      },
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      },
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };
  


//   Function: requestPermissions
//   Description: Requests BLE permissions based on the platform.
//   Returns: Promise<boolean> indicating if permissions were granted.
const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

 
  // Function: scanForPeripherals
  // Description: Initiates scanning for BLE peripherals.
  // Returns: Void function 
 
  const scanForPeripherals = () => {
    const scannedDevices = new Set();
    let rescanTimer: string | number | NodeJS.Timeout | undefined;
    
    // Setting a timer to restart scanning for BLE devices
    const startRescanTimer = () => {
      rescanTimer = setTimeout(() => {
        console.log("Rescanning after 10 seconds...");
        deviceNames.length = 0;
        rssiValues.length = 0;
        scannedDevices.clear();
        scanForPeripherals(); // Restart scanning
      }, 20000);
    };
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }

      if ((device && device.name?.includes("Device"))) {
        // will inclue the beacon name that we are using ?.includes("")
        if (!scannedDevices.has(device.id)) {
          scannedDevices.add(device.id);
          deviceNames.push(device.name);
          if (device.rssi !== null) {
            rssiValues.push(device.rssi);
          } else {
            console.log("RSSI is null for device:", device.name);
          }
          if (deviceNames.length >= 3) {
            console.log("Scan stopped after finding 3 devices.");
            bleManager.stopDeviceScan();
            sendRequest();
            clearTimeout(rescanTimer);
            startRescanTimer();
          }
        }
      }
    });
  };



//   Function: sendRequest
//   Description: Sends data (scanned BLE device names and RSSI) to a Django server via HTTP POST request.
  const sendRequest = () => {
    const ismoving = getSharedValue();
    const jsonData = {
      beacons: deviceNames.map((name, index) => ({ 
        name: name,
        rssi: rssiValues[index], 
      })),
      phoneid: deviceName,
      moving: ismoving, //update on basis of checkbox
    };

 
  console.log(JSON.stringify(jsonData));
    
    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    };
   
    // Send's a Post request to Django server
    // Here the input paarameter is json which has BLE device name, RSSI, Phone ID, And Moving flag
    // Output is a json file which has all the nearby sensors and mitigation statergy around it. 
    fetch("http://192.168.0.178:8000/location/", requestOptions) 
      .then((response) => {
        if (!response.ok) {
          
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
       
        console.log("Response from server:", data);
        setjdata(data);
      })
      .catch((error) => {
       
        console.error("Error:", error);
      });
     
  };
  return {
    scanForPeripherals,
    requestPermissions,
  };
}

export default useBLE;
