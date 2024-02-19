import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import secretKey from "../../../private/secretKey";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";
import axios from "axios";

const index = () => {
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState("");
  const [posts, setPosts] = useState([]);

  // for fetching the user-details
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // fetch the logged in user details
  useEffect(() => {
    if (userId) {
      fetchUserProfile();
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

  useEffect(() => {
    // fetching all the posts
    const fetchAllPosts = async () => {
      try {
        const response = await axios.get(
          "http://192.168.29.181:8080/user/fetch-posts"
        );

        setPosts(response.data.posts);
      } catch (error) {
        console.log("error fetching all posts", error);
      }
    };

    fetchAllPosts();
  }, []);

  console.log('posts' , posts)

  return (
    <View>
      <Text>index</Text>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
