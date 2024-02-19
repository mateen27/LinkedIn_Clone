import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import React, { useState } from "react";

// icons import
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const index = () => {
  // state management
  const [description, setDescription] = useState("");

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
          <Pressable style={styles.pressableStyle}>
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

      <Pressable style={styles.iconContainer}>
        <Pressable style={styles.iconStyle}>
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
    backgroundColor : '#fbfbf9'
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
