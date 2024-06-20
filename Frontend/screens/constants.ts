// File: constants.ts
// Description: This file contains shared constants and functions used across the application
// Developed by: [Vidit Sanghvi]
// Copyright 2024 

// Variable to store shared boolean value
let sharedValue: boolean = false;

// Variable to store JSON data
let jdata: Record<string, any> = {};


// Function: setSharedValue
// Description: Sets the shared boolean value.
// Arguments:
//   - value: Boolean value to be set.
export const setSharedValue = (value: boolean) => {
  console.log("In set shared value");
  sharedValue = value;
};

// Function: setjdata
// Description: Sets the JSON data.
// Arguments:
//   - value: JSON data to be set.
export const setjdata = (value: Record<string, any>) => {
  jdata = value;
};


// Function: getSharedValue
// Description: Retrieves the shared boolean value.
// Returns:
//   - sharedValue: Boolean value.
export const getSharedValue = () => sharedValue;



// Function: getjdata
// Description: Retrieves the JSON data.
// Returns:
//   - jdata: JSON data.
export const getjdata = () => jdata;
