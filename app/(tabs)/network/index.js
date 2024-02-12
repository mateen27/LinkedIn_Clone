import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";
import secretKey from "../../../private/secretKey";
import axios from "axios";
// icons import
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import UserProfile from "../../../components/UserProfile";

const index = () => {
  // state management
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState();
  const [users, setUsers] = useState();

  // for fetching the user-details
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // fetch the logged in user details
  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUsers();
    }
  }, [userId]);

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

  // console.log("userId: " + userId);

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

  // function for fetching the users which are not connected to the currently logged in user
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `http://192.168.29.181:8080/user/users/${userId}`
      );
      // console.log('response' , response.data)

      // storing the users information into the state
      setUsers(response.data);

      // const users =
    } catch (error) {
      console.log("error fetching users", error);
    }
  };

  console.log("users", users);

  return (
    <ScrollView style={styles.container}>
      {/* for the heading text */}
      <Pressable style={styles.manageNetworkStyle}>
        <Text style={styles.manageTextStyle}>Manage My Network</Text>
        <AntDesign name="arrowright" size={22} color="black" />
      </Pressable>

      {/* creating the seperation */}
      <View
        style={{ borderColor: "#e0e0e0", borderWidth: 2, marginVertical: 10 }}
      />

      {/* for the invitation text and arrow button */}
      <View style={styles.invitationContainer}>
        <Text style={styles.invitationTextStyle}>Invitations (0)</Text>
        <AntDesign name="arrowright" size={22} color="black" />
      </View>

      {/* creating the seperation */}
      <View
        style={{ borderColor: "#e0e0e0", borderWidth: 2, marginVertical: 10 }}
      />

      {/* for showing all the connection requests */}
      <View></View>

      {/* for showing the people who are not connected */}
      <View style={styles.growNetworkContainer}>
        <View style={styles.growNetworkStyle}>
          <Text>Grow your network faster</Text>
          <Entypo name="cross" size={24} color="black" />
        </View>

        <Text>
          Find and contact the right people. Plus see who's viewed your profile!
        </Text>

        {/* for premium badge  */}
        <View style={styles.premiumBadgeContainer}>
          <Text style={styles.premiumTextStyle}>Try Premium</Text>
        </View>
      </View>

      {/* list of users apart from the logged-in user! */}
      <FlatList
        data={users}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        numColumns={2}
        keyExtractor={(item) => item._id}
        renderItem={({ item, key }) => <UserProfile item={item} key={index} />}
      />
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  manageNetworkStyle: {
    marginTop: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  manageTextStyle: {
    fontSize: 16,
    fontWeight: "600",
  },
  invitationContainer: {
    marginTop: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  invitationTextStyle: {
    fontSize: 16,
    fontWeight: "600",
  },
  growNetworkContainer: {
    marginHorizontal: 15,
  },
  growNetworkStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  premiumBadgeContainer: {
    backgroundColor: "#FFC72C",
    width: 140,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 25,
    marginTop: 8,
  },
  premiumTextStyle: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
});
