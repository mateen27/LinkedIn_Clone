import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import secretKey from "../../../private/secretKey";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";
import axios from "axios";

// icons import
import { Feather, FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const index = () => {
  // variables
  const MAX_LINES = 2;
  // state management
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState("");
  const [posts, setPosts] = useState([]);
  const [showFullText, setShowFullText] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // function to show the full text of the post
  const toggleShow = () => {
    setShowFullText(!showFullText);
  };
  // function for liking the post
  const handleLikePost = async (postId) => {
    try {
      const response = await axios.post(
        `http://192.168.29.181:8080/user/like/${postId}/${userId}`
      );

      if (response.status === 200 || response.status === 201) {
        const updatePost = response.data.post;
        setIsLiked(updatePost.likes.some((like) => like.user === userId));
      }
    } catch (error) {
      console.log("error liking/unliking the post", error);
    }
  };

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

  // console.log("posts", posts);

  // Array of LinkedIn bios
  const linkedinBios = [
    "Passionate about leveraging technology to solve real-world problems.",
    "Experienced professional with a proven track record of driving business growth.",
    "Dedicated to continuous learning and professional development.",
    "Results-oriented individual with a focus on delivering exceptional outcomes.",
    "Innovative thinker with a passion for driving positive change.",
    "Skilled communicator with a knack for building strong relationships.",
    "Strategic thinker with a focus on delivering results and exceeding expectations.",
    "Detail-oriented professional with a passion for problem-solving and continuous improvement.",
    "Creative thinker with a knack for developing unique solutions to complex challenges.",
    "Results-driven leader with a commitment to excellence and a passion for success.",
    "Dynamic communicator skilled in building relationships and driving collaboration.",
    "Innovative problem-solver with a strong background in data analysis and strategy development.",
    "Team player with a proven ability to thrive in fast-paced environments and deliver exceptional results.",
  ];

  // Function to randomly pick a LinkedIn bio from the array
  const getRandomBio = () => {
    // Generate a random index within the length of the array
    const randomIndex = Math.floor(Math.random() * linkedinBios.length);
    // Return the bio at the randomly selected index
    return linkedinBios[randomIndex];
  };

  const profileBio = getRandomBio();

  // function for formatting the dates
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      {/* View for the header */}
      <View
        style={{
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Pressable>
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

      <View
        style={{
          borderColor: "#e0e0e0",
          borderWidth: 2,
          height: 2,
          marginBottom: 10,
        }}
      />

      {/* View for the posts */}
      <View>
        {posts.map((item, index) => (
          <View key={index}>
            {/* View for the profile information like name , bio , profileImage , dateOfPost */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Image
                style={{ width: 60, height: 60, borderRadius: 30 }}
                source={{ uri: item?.user?.profileImage }}
              />

              {/* description of the user */}
              <View>
                <Text style={{ fontSize: 15, fontWeight: "600" }}>
                  {item?.user?.name}
                </Text>
                <Text
                  numberOfLines={2}
                  style={{ width: 230, color: "grey", fontWeight: "400" }}
                >
                  {profileBio}
                </Text>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontWeight: "300", color: "grey" }}>
                    {formatDate(item?.createdAt)} •{" "}
                  </Text>

                  <FontAwesome5 name="globe-americas" size={14} color="grey" />
                </View>
              </View>

              {/* for the icons */}
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Entypo name="dots-three-vertical" size={24} color="black" />
                <Feather name="x" size={24} color="black" />
              </View>
            </View>

            {/* View for the decription of the post */}
            <View style={styles.descriptionStyles}>
              <Text numberOfLines={showFullText ? undefined : MAX_LINES}>
                {item?.description}
              </Text>
              {!showFullText && (
                <Pressable onPress={toggleShow}>
                  <Text style={{ color: "grey" }}>See More...</Text>
                </Pressable>
              )}
            </View>

            {/* post image */}
            <Image
              style={{ width: "100%", height: 240 }}
              source={{ uri: item?.imageUrl }}
            />

            {/* for likes */}
            {item?.likes?.length > 0 && (
              <View
                style={{
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <SimpleLineIcons name="like" size={16} color="#0072b1" />
                <Text style={{ color: "grey" }}>{item?.likes?.length}</Text>
              </View>
            )}

            {/* border after image */}
            <View
              style={{ borderColor: "#e0e0e0", borderWidth: 2, height: 2 }}
            />

            {/* for the like comment icons */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                marginVertical: 10,
              }}
            >
              <Pressable onPress={() => handleLikePost(item?._id)}>
                <AntDesign
                  style={{ textAlign: "center" }}
                  name="like2"
                  size={20}
                  color={isLiked ? '#0072b1' : 'grey'}
                />
                <Text
                  style={{
                    textAlign: "center",
                    color: isLiked ? '#0072b1' : 'grey',
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  Like
                </Text>
              </Pressable>
              <Pressable>
                <FontAwesome
                  name="comment-o"
                  size={20}
                  color="gray"
                  style={{ textAlign: "center" }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 2,
                    fontSize: 12,
                    color: "gray",
                  }}
                >
                  Comment
                </Text>
              </Pressable>
              <Pressable>
                <Feather
                  style={{ textAlign: "center" }}
                  name="share"
                  size={20}
                  color="grey"
                />
                <Text
                  style={{
                    marginTop: 2,
                    fontSize: 12,
                    textAlign: "center",
                    color: "gray",
                  }}
                >
                  repost
                </Text>
              </Pressable>
              <Pressable>
                <Feather
                  style={{ textAlign: "center" }}
                  name="send"
                  size={20}
                  color="gray"
                />
                <Text style={{ marginTop: 2, fontSize: 12, color: "gray" }}>
                  Send
                </Text>
              </Pressable>
            </View>

            <View
              style={{ borderColor: "#e0e0e0", borderWidth: 2, height: 2 }}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({
  imageStyle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  descriptionStyles: {
    marginTop: 10,
    marginHorizontal: 15,
    marginBottom: 12,
  },
});
