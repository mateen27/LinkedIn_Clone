import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import secretKey from "../../../private/secretKey";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import JWT from "expo-jwt";
// icons import
import { AntDesign } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const connections = () => {
  // state management
  const [userId, setUserId] = useState("");
  const [connections, setConnections] = useState([]);

  // for fetching the user-details
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // fetch the logged-in user id
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

  // for fetching the connection of the logged in user
  useEffect(() => {
    if (userId) {
      fetchConnections();
    }
  }, [userId]);

  // function for fetching the connection of the logged in user
  const fetchConnections = async () => {
    try {
      const response = await axios.get(
        `http://192.168.29.181:8080/user/connections/${userId}`
      );

      // storing the users information into the state
      setConnections(response.data);
    } catch (error) {
      console.log("Error fetching connections", error);
    }
  };

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

  // console.log("connections", connections);
  return (
    <View style={styles.connectionsContainer}>
      <View style={styles.headingContainer}>
        <Text style={{ fontWeight: "500" }}>
          {connections.length} Connections
        </Text>
        <View style={styles.iconContainer}>
          <AntDesign name="search1" size={22} color="black" />
          <Octicons name="three-bars" size={22} color="black" />
        </View>
      </View>

      {/* for the line to be displayed */}
      <View style={styles.lineStyle} />

      {/* for the connections to make them visible */}
      <View style={{ marginHorizontal: 10, marginTop: 10 }}>
        {connections.map((item, index) => (
          <View style={styles.mainContainer} key={index}>
            {/* for the image */}
            <Image
              style={styles.imageStyle}
              source={{ uri: item?.profileImage }}
            />

            {/* for the name , bio and connectedAt */}
            <View style={styles.infoContainer}>
              {/* name */}
              <Text style={{ fontSize: 15, fontWeight: "500" }}>
                {item?.name}
              </Text>

              {/* bio */}
              <Text style={{ color: "gray" }}>{profileBio}</Text>

              {/* connectedAT */}
              <Text style={{ color: "gray" }}>
                {formatDate(item?.createdAt)}
              </Text>
            </View>
            {/* for the icons */}
            <View style={styles.iconStyle}>
              <Entypo name="dots-three-vertical" size={20} color="black" />
              <Feather name="send" size={20} color="black" />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default connections;

const styles = StyleSheet.create({
  connectionsContainer: {
    backgroundColor: "#fff",
    flex: 1,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 12,
    marginTop: 10,
  },
  lineStyle: {
    height: 2,
    borderColor: "#e0e0e0",
    borderWidth: 2,
    marginTop: 12,
  },
  imageStyle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    resizeMode: "cover",
  },
  infoContainer: {
    flexDirection: "column",
    gap: 2,
    flex: 1,
  },
  iconStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    gap: 10,
  },
});
