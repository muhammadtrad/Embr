import React, { useState } from 'react';
import styles from "./styles.js";

import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Button,
    Alert,
    Image,
    TouchableOpacity
} from 'react-native';

const companyLogoObj = {
  'google': 'google.jpg',
  'twitter': 'twitter.png',
  'facebook': 'facebook.png',
  'amazon': 'amazon.png',
  'netflix': 'netflix.jpg',
  'slack': 'slack.jpg',
  'sqaure': 'sqaure.png',
  'tesla': 'tesla.jpg',
  'microsoft': 'microsoft.png',
  "apple": 'apple.png'
}

const statusColor = (status) => {
  switch(status){
    case 'Not yet applied':
      return 'blue';
    case 'Applied, waiting to hear back':
      return 'yellow';
    case 'Heard back':
      return 'green';
    case 'Offer received':
      return 'purple';
    case 'Rejected':
      return 'red';
    default:
      return 'blue';
  }
}

const PostCard = ({ navigation, /*jobObj, logoName*/}) => {
  // const logoName = companyLogoObj[jobObj.companyName.toLowerCase()];

  // const color = statusColor(jobObj.status);
  //{...styles.PostCardFrame, backgroundColor: color} ThESE ARE THE STYLES FOR THE FIRST VIEW COMPONENT
  const logoName = 'google.jpg'; //temp line until backend gets merged
  return (
    <View style={styles.PostCardFrame}>
      <TouchableOpacity onPress={() => navigation.navigate('PostFull' /*, {jobObj: jobObj}*/)}>
  <Text style={styles.CompanyName}>COMPANY NAME {/*{jobObj.companyName}*/}</Text>
        <Text style={styles.JobTitle}>JOB TITLE {/*{jobObj.jobTitle}*/}</Text>
        <View style={styles.imageContainer}>
            <Image style={styles.logo} source={require(`./assets/${logoName}`)} />
        </View>
      </TouchableOpacity>
      
    </View>
  );
};

export default PostCard;