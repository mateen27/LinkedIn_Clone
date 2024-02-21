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
  Button,
  Alert,
} from "react-native";
import React, { useState } from "react";
// icons imports
import { MaterialIcons } from "@expo/vector-icons";
// expo router
import { useRouter } from "expo-router";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker'

const register = () => {
  // state management
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");

  //   router
  const router = useRouter();

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      // console.log();

      if (!result.cancelled) {
        setImage(result.assets[0].uri);
      } else {
        Alert.alert("You canceled the image selection.");
      }
    } catch (error) {
      console.error("Error picking image: ", error);
    }
  };

  // function for uploading Image to The Cloudinary Service
  const uploadImageToCloudinary = async () => {
    if (image) {
      const data = new FormData();
      data.append("file", {
        uri: image,
        type: `image/${image.split(".").pop()}`,
        name: `test.${image.split(".").pop()}`,
      });
      data.append("upload_preset", "ShowStarter");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dvvnup3nh/image/upload",
          {
            method: "post",
            body: data,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          const cloudinaryData = await response.json();
          if (cloudinaryData.secure_url) {
            console.log("Image uploaded to Cloudinary: ", cloudinaryData.secure_url);
            return cloudinaryData.secure_url;
          }
        }
        console.log("Image upload to Cloudinary failed");
      } catch (error) {
        console.error("Error uploading to Cloudinary: ", error);
      }
    } else {
      Alert.alert("Please select an image before uploading.");
    }
  };

  //   function for registering the user
  const handleRegister = async () => {

    const cloudinaryUrl = await uploadImageToCloudinary();
    const user = {
      name,
      email,
      password,
      profileImage: cloudinaryUrl,
    };

    axios
      .post(`http://192.168.29.181:8080/user/register`, user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Registeration successful!",
          "You have been registered successfully"
        );
        setName("");
        setEmail("");
        setPassword("");
        setImage("");
      })
      .catch((error) => {
        Alert.alert(
          "Registeration failed",
          "An error occurred while registering the user!"
        );
        console.log("registeration failed", error);
      });
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
          <Text style={styles.headingTextStyle}>Register for your Account</Text>
        </View>

        <View style={styles.formHolderContainerStyle}>
          {/* name placeholder section */}
          <View style={styles.emailPlaceholderStyle}>
            <MaterialIcons
              style={styles.emailIconStyle}
              name="person"
              size={24}
              color="black"
            />
            <TextInput
              style={[styles.emailInputStyle, { fontSize: name ? 16 : 14 }]}
              placeholder="Enter your Name"
              value={name}
              onChangeText={(name) => setName(name)}
            />
          </View>
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
          {/* for the image upload */}
          <View style={styles.emailPlaceholderStyle}>
            <MaterialIcons
              style={styles.emailIconStyle}
              name="image"
              size={24}
              color="black"
            />
            <TouchableOpacity
              style={[styles.uploadButtonStyle, { width: 200 }]} // Adjust the width here
              onPress={() => pickImage()}
            >
              <Text style={styles.uploadButtonTextStyle}>Upload an Image</Text>
            </TouchableOpacity>
          </View>

          {/* for the spacing between the text and the button */}
          <View style={{ marginTop: 50 }} />

          <TouchableOpacity
            onPress={() => handleRegister()}
            style={styles.loginButtonContainer}
          >
            <Text style={styles.loginButtonTextStyle}>Register</Text>
          </TouchableOpacity>

          <Pressable
            onPress={() => router.push("/login")}
            style={styles.signUpButtonContainer}
          >
            <Text style={styles.signUpTextStyle}>
              Already have an account? Login
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default register;

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
    marginTop: 50,
  },
  emailPlaceholderStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#e0e0e0",
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 30,
    // marginBottom: 5,
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
  uploadButtonStyle: {
    // backgroundColor: "#333",
    padding: 12,
    justifyContent: "center",
  },
  uploadButtonTextStyle: {
    color: "#6B6B6B",
    marginLeft: -10,
  },
});
