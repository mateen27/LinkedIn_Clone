import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import secretKey from "../../../private/secretKey";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { firebase } from "../../../firebase";

// icons import
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const index = () => {
  // state management
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [userId, setUserId] = useState("");

  // router
  const router = useRouter();

  // for fetching the user-details
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // fetch the logged-in user details
  const fetchUserDetails = async () => {
    try {
      // accessing the token from AsyncStorage
      const userID = await AsyncStorage.getItem("userID");
      // console.log('userID' , userID);

      // decoding the token [userID]
      const decodeUserID = JWT.decode(userID, secretKey);
      // console.log("Decoded Token:", decodeUserID);

      // setting to the userID to the state
      setUserId(decodeUserID.userID);
    } catch (error) {
      console.log("Error fetching userId", error);
    }
  };

  // function to pick the images from the gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // console.log('image' , image);

  // function to create the post
  const createPost = async () => {
    try {
      const uploadUrl = await uploadFile();

      const postData = {
        description: description,
        imageUrl: uploadUrl,
        userId: userId,
      };

      const response = await axios.post(
        "http://192.168.29.181:8080/user/create-post",
        postData
      );

      console.log("post created", response.data);

      if (response.status === 201 || response.status === 200) {
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      console.log("error creating post", error);
    }
  };

  // function to upload the file
  const uploadFile = async () => {
    try {
      // Ensure that 'image' contains a valid file URI
      console.log("Image URI:", image);

      const { uri } = await FileSystem.getInfoAsync(image);

      if (!uri) {
        throw new Error("Invalid file URI");
      }

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (e) => {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const filename = image.substring(image.lastIndexOf("/") + 1);

      const ref = firebase.storage().ref().child(filename);
      await ref.put(blob);

      const downloadURL = await ref.getDownloadURL();
      // setUrl(downloadURL);
      return downloadURL;
      // Alert.alert("Photo uploaded");
    } catch (error) {
      console.log("Error:", error);
      // Handle the error or display a user-friendly message
    }
  };

  return (
    <ScrollView style={styles.scrollViewContainer}>
      {/* View for the Header */}
      <View style={styles.headerContainer}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Post</Text>
      </View>
      <View style={styles.outerContainer}>
        <View style={styles.itemContainer}>
          <Entypo name="circle-with-cross" size={24} color="black" />
          <View style={styles.imageContainer}>
            <Image
              style={styles.imageStyle}
              source={{
                uri: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
              }}
            />
            <Text style={{ fontWeight: "500" }}>Anyone</Text>
          </View>
        </View>

        <View style={[styles.itemContainer, { marginRight: 8 }]}>
          <Entypo name="back-in-time" size={24} color="black" />
          <Pressable onPress={createPost} style={styles.pressableStyle}>
            <Text
              style={{
                textAlign: "center",
                // fontWeight: "bold",
                fontSize: 16,
                color: "#fff",
              }}
            >
              Post
            </Text>
          </Pressable>
        </View>
      </View>

      <TextInput
        placeholder="What do you want to talk about?"
        placeholderTextColor={"black"}
        value={description}
        onChangeText={(text) => setDescription(text)}
        multiline={true}
        numberOfLines={5}
        textAlignVertical={"top"}
        style={styles.textInputStyle}
      />

      <View>
        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: "100%", height: 240, marginVertical: 20 }}
          />
        )}
      </View>

      <Pressable style={styles.iconContainer}>
        <Pressable onPress={() => pickImage()} style={styles.iconStyle}>
          <MaterialIcons name="perm-media" size={24} color="black" />
        </Pressable>
        <Text>Media</Text>
      </Pressable>
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageStyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pressableStyle: {
    padding: 10,
    backgroundColor: "#0072b1",
    borderRadius: 20,
    width: 80,
  },
  outerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 15,
  },
  headerContainer: {
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  textInputStyle: {
    marginHorizontal: 10,
    fontSize: 15,
    fontWeight: "500",
    marginTop: 10,
    backgroundColor: "#fbfbf9",
  },
  iconStyle: {
    width: 40,
    height: 40,
    marginTop: 15,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    flexDirection: "column",
    marginRight: "auto",
    marginLeft: "auto",
  },
});
