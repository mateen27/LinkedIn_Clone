import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
// icons imports
import { MaterialIcons } from "@expo/vector-icons";
// expo router
import { useRouter } from "expo-router";
// imports
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";
import secretKey from "../../private/secretKey";

const login = () => {
  // state management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //   router
  const router = useRouter();

  //   checking the login status
  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     try {
  //       // accessing the token from async storage!
  //       const token = await AsyncStorage.getItem("authToken");

  //       // if token found
  //       if (token) {
  //         router.replace("/(tabs)/home");
  //       } else {
  //         // token not found navigate to the Login Screen itself!
  //       }
  //     } catch (error) {
  //       console.log("error checking the login status", error);
  //     }
  //   };

  //   // calling the function
  //   checkLoginStatus();
  // }, []);

  //   function for logging the user in the application
  const handleLogin = async () => {
    try {
      const user = {
        email,
        password,
      };

      const response = await axios.post(
        "http://192.168.29.181:8080/user/login",
        user
      );

      console.log(response);

      if (response.status === 201 || response.status === 200) {
        // accessing the token
        const token = response.data.token;
        console.log("token : ", token);

        // accessing the userID
        const userID = response.data.user._id;
        // console.log("userID : ", userID);

        // encoding the userID
        const encodeUserID = JWT.encode({ userID } , secretKey);
        // console.log("encodeUserID : ", encodeUserID);

        // storing the token in async Storage!
        AsyncStorage.setItem("authToken", token);

        // storing the userID in async Storage
        AsyncStorage.setItem("userID", encodeUserID);

        // navigating to the Home Screen!
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Login Error", "Invalid email or password!");
        console.log(response.status);
      }
    } catch (error) {
      // Handle errors from the request or AsyncStorage
      console.error("Login error:", error);
      Alert.alert("Login Error", "An error occurred during login.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
          style={styles.imageStyle}
          source={{
            uri: "https://www.freepnglogos.com/uploads/linkedin-logo-transparent-png-25.png",
          }}
        />
      </View>

      {/* form */}
      <KeyboardAvoidingView>
        <View style={styles.formContainer}>
          {/* heading Text */}
          <Text style={styles.headingTextStyle}>Log in to your Account</Text>
        </View>

        <View style={styles.formHolderContainerStyle}>
          {/* email placeholder section */}
          <View style={styles.emailPlaceholderStyle}>
            <MaterialIcons
              style={styles.emailIconStyle}
              name="email"
              size={24}
              color="black"
            />
            <TextInput
              style={[styles.emailInputStyle, { fontSize: email ? 16 : 14 }]}
              placeholder="Enter your Email"
              value={email}
              onChangeText={(email) => setEmail(email)}
            />
          </View>
          {/* password placeholder section */}
          <View style={styles.emailPlaceholderStyle}>
            <MaterialIcons
              style={styles.emailIconStyle}
              name="lock"
              size={24}
              color="black"
            />
            <TextInput
              style={[styles.emailInputStyle, { fontSize: password ? 16 : 14 }]}
              placeholder="Enter your Password"
              secureTextEntry={true}
              value={password}
              onChangeText={(password) => setPassword(password)}
            />
          </View>

          {/* form bottom text container */}
          <View style={styles.formBottomTextStyle}>
            <Text>Keep me logged in</Text>

            <Text style={styles.forgotPasswordTextStyle}>Forgot Password</Text>
          </View>

          {/* for the spacing between the text and the button */}
          <View style={{ marginTop: 80 }} />

          <TouchableOpacity
            onPress={() => handleLogin()}
            style={styles.loginButtonContainer}
          >
            <Text style={styles.loginButtonTextStyle}>Login</Text>
          </TouchableOpacity>

          <Pressable
            onPress={() => router.push("/register")}
            style={styles.signUpButtonContainer}
          >
            <Text style={styles.signUpTextStyle}>
              Don't have an account? Sign Up
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  imageStyle: {
    width: 150,
    height: 100,
    resizeMode: "contain",
  },
  formContainer: {
    alignItems: "center",
  },
  headingTextStyle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#041E42",
    marginTop: 12,
  },
  formHolderContainerStyle: {
    marginTop: 70,
  },
  emailPlaceholderStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#e0e0e0",
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 30,
    marginBottom: 10,
  },
  emailIconStyle: {
    marginLeft: 10,
  },
  emailInputStyle: {
    color: "gray",
    width: 300,
    marginVertical: 10,
  },
  formBottomTextStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  forgotPasswordTextStyle: {
    color: "#007FFF",
    fontWeight: "500",
  },
  loginButtonContainer: {
    backgroundColor: "#0072b1",
    width: 200,
    borderRadius: 10,
    padding: 15,
    marginLeft: "auto",
    marginRight: "auto",
  },
  loginButtonTextStyle: {
    textAlign: "center",
    color: "#f2f2f2",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpButtonContainer: { marginTop: 15 },
  signUpTextStyle: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
});
