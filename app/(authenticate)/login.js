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
} from "react-native";
import React, { useState } from "react";
// icons imports
import { MaterialIcons } from "@expo/vector-icons";
// expo router
import { useRouter } from "expo-router";

const login = () => {
  // state management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //   router
  const router = useRouter();

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

          <TouchableOpacity style={styles.loginButtonContainer}>
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