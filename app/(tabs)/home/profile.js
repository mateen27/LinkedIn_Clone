import {
  Button,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import secretKey from "../../../private/secretKey";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";
import { useRouter } from "expo-router";
import axios from "axios";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";

const profile = () => {
  // state management
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [userDescription, setUserdescription] = useState("");

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

  // fetch the logged in user details
  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  // fetching user Profile Information from the server
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://192.168.29.181:8080/user/profile/${userId}`
      );
      // console.log('response', response.data.user);

      // storing the user profile information
      const userDataa = await response.data.user;

      if (userDataa) {
        // storing the data of the user profile into state
        setUserData(userDataa);
      }
    } catch (error) {
      console.log("error fetching userProfile", error);
    }
  };

  // function to save the user Description
  const handleSaveDescription = async () => {
    try {
      const response = await axios.put(
        `http://192.168.29.181:8080/user/update-description/${userId}`,
        { userDescription }
      );

      if (response.status === 200 || response.status === 201) {
        await fetchUserProfile();

        setIsEditing;
        false;
      }
    } catch (error) {
      console.log("error saving userDescription", error);
    }
  };

  // function for logging out the user profile
  const logout = async () => {
    await AsyncStorage.removeItem("userID");
    await AsyncStorage.removeItem("authToken");
    console.log("logged out");
    router.replace("/(authenticate)/login");
  };

  // console.log(userData);

  return (
    <View>
      {/* View for the header */}
      <View
        style={{
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Pressable onPress={() => router.push("/home/profile")}>
          <Image
            style={styles.imageStyle}
            source={{ uri: userData?.profileImage }}
          />
        </Pressable>

        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "#fff",
            borderRadius: 3,
            height: 30,
            flex: 1,
          }}
        >
          <Feather
            style={{ marginLeft: 10 }}
            name="search"
            size={24}
            color="black"
          />
          <TextInput placeholder="Search" />
        </Pressable>

        <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
      </View>

      {/* for the cover image */}

      <Image
        style={{ width: "100%", height: 130 }}
        source={{
          uri: "https://media.istockphoto.com/id/937025430/photo/abstract-defocused-blue-soft-background.jpg?b=1&s=612x612&w=0&k=20&c=FwJnRNxkX_lZKImOoJbo5VsgZPCMNiODdsRsggJqejA=",
        }}
      />

      {/* View for the profile of the user user information */}
      <View style={{ position: "absolute", top: 130, left: 10 }}>
        <Image
          style={{
            height: 120,
            width: 120,
            borderRadius: 60,
            resizeMode: "cover",
          }}
          source={{ uri: userData?.profileImage }}
        />

        {/* for the name and bio info */}
        <View>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginHorizontal: 5,
              marginTop: 8,
            }}
          >
            {userData?.name}
          </Text>
          {/* for the description */}
          <Pressable onPress={() => setIsEditing(!isEditing)}>
            <Text
              style={{
                marginHorizontal: 5,
                fontSize: 15,
                marginTop: 2,
                color: "grey",
              }}
            >
              {userData?.userDescription ? "Edit" : "Add Bio"}
            </Text>
          </Pressable>

          <View>
            {isEditing ? (
              <>
                <TextInput
                  placeholder="Enter the description"
                  placeholderTextColor={"grey"}
                  value={userDescription}
                  onChangeText={(value) => setUserdescription(value)}
                />

                <Button title="Save" onPress={() => handleSaveDescription()} />
              </>
            ) : (
              <Text
                style={{
                  marginHorizontal: 5,
                  color: "grey",
                  fontWeight: "500",
                }}
              >
                {userData?.userDescription}
              </Text>
            )}
          </View>

          {/* profession and current location  */}
          <Text
            style={{
              marginTop: 12,
              fontWeight: "500",
              fontSize: 15,
              marginHorizontal: 5,
            }}
          >
            Youtube • Linkedin Member
          </Text>
          <Text style={{ fontSize: 15, color: "gray", marginHorizontal: 5 }}>
            Bengaluru, Karnataka, India
          </Text>
        </View>

        {/* for the buttons */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 12,
            marginHorizontal: 5,
          }}
        >
          <Pressable
            style={{
              backgroundColor: "#0072b1",
              paddingVertical: 4,
              paddingHorizontal: 10,
              borderRadius: 25,
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Open to</Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: "#0072b1",
              paddingVertical: 4,
              paddingHorizontal: 10,
              borderRadius: 25,
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              Add Section
            </Text>
          </Pressable>
        </View>

        {/* Analytics */}
        <View style={{ flexDirection: "row", gap: 7, marginTop: 10 }}>
          <Ionicons name="people" size={28} color="black" />
          <View style={{ marginLeft: 7 }}>
            <Text style={{ fontSize: 15, fontWeight: "600" }}>
              350 profile views
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                color: "gray",
                marginTop: 1,
              }}
            >
              Discover who's viewed your profile
            </Text>
          </View>
        </View>

        {/* post impressions */}
        <View style={{ flexDirection: "row", gap: 7, marginTop: 10 }}>
          <Entypo name="bar-graph" size={24} color="black" />
          <View style={{ marginLeft: 7 }}>
            <Text style={{ fontSize: 15, fontWeight: "600" }}>
              1242 post Impressions
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                color: "gray",
                marginTop: 1,
              }}
            >
              Checkout who's engaing with your posts
            </Text>
          </View>
        </View>

        {/* no of times viewed in search results */}
        <View style={{ flexDirection: "row", gap: 7, marginTop: 10 }}>
          <Feather name="search" size={24} color="black" />
          <View style={{ marginLeft: 7 }}>
            <Text style={{ fontSize: 15, fontWeight: "600" }}>
              45 post appearenced
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                color: "gray",
                marginTop: 1,
              }}
            >
              see how often you appear in search results
            </Text>
          </View>
        </View>

        {/* for logging out */}
        <Pressable style = {{ width : 100 , marginVertical : 20 , marginHorizontal : 5  }} onPress={logout}>
          <Text style = {{ backgroundColor : '#0072b1' , padding : 15 , color : '#fff' , borderRadius : 50 , fontSize : 14 , fontWeight : '600' , textAlign : 'center' }}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({
  imageStyle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});
