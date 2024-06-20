import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";
import app from "../firebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const Signup = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const auth = getAuth(app);

  const signUp = async () => {
    if (!username || !email || !password || !confirm) {
      alert("Please fill in all fields");
      return;
    }

    if (password.length < 7) {
      alert("Password must be atleast 7 characters long");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log(response);
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
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
          }}
        >
          Sign up
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: COLORS.black,
            marginBottom: 10,
          }}
        >
          Sign up to your account
        </Text>

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginVertical: 8,
            }}
          >
            Username
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
              placeholder="Enter username"
              placeholderTextColor={COLORS.black}
              value={username}
              onChangeText={(username) => setUsername(username)}
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
              placeholder="Enter email Address"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
              value={email}
              onChangeText={(email) => setEmail(email)}
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
                <Ionicons name="eye-off" size={24} color={COLORS.black} />
              ) : (
                <Ionicons name="eye" size={24} color={COLORS.black} />
              )}
            </TouchableOpacity>
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
            Confirm Password
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
              placeholder="Confirm the password"
              placeholderTextColor={COLORS.black}
              secureTextEntry
              value={confirm}
              onChangeText={(confirm) => setConfirm(confirm)}
              style={{
                width: "100%",
              }}
            />
          </View>
        </View>
        <Button
          title="Sign Up"
          filled
          onPress={signUp}
          style={{
            marginTop: 18,
            marginBottom: 4,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 8,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: COLORS.black,
            }}
          >
            Already have an account?
          </Text>
          <Pressable
            onPress={() => navigation.navigate("Login")}
            style={{
              marginLeft: 6,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Signup;
