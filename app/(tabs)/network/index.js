import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";
import secretKey from "../../../private/secretKey";
import axios from "axios";

const index = () => {
  // state management
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState();
  const [ users , setUsers ] = useState();

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

  // fetching the people details whi are not connected to the logged in users
  // useEffect(() => {
  //   if (userData) {
  //     fetchUsers();
  //   }
  // } , [userId]);

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

      if ( userDataa ) {
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
      const response = await axios.get(`http://192.168.29.181:8080/user/users/${userId}`);
      // console.log('response' , response.data)

      // storing the users information into the state
      setUsers(response.data);

      // const users = 
    } catch (error) {
      console.log("error fetching users", error);
    }
  }

  console.log('users' , users)
 
  return (
    <View>
      <Text>index</Text>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
