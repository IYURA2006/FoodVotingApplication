import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'; // Import Firestore from Firebase SDK
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../../FirebaseConfig';

const HomeScreen = () => {
  const [mainFoodOptionName, setMainFoodOptionName] = useState('');

  useEffect(() => {
    // Function to fetch and calculate the most voted food option name
    const fetchMainFoodOptionName = async () => {
      try {
        // Retrieve previous day's voting data from Firestore
        const yesterdayVotesSnapshot = await firestore()
          .collection('voting')
          .doc(getYesterdayDate())
          .get();

        // Get data from Firestore snapshot
        const yesterdayVotesData = yesterdayVotesSnapshot.data();

        if (yesterdayVotesData) {
          // Calculate the most voted food option name
          const mostVotedOptionName = calculateMostVotedOptionName(yesterdayVotesData);
          setMainFoodOptionName(mostVotedOptionName);
        }
      } catch (error) {
        console.error('Error fetching main food option name:', error);
      }
    };

    fetchMainFoodOptionName();
  }, []);

  // Function to get yesterday's date
  const getYesterdayDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  // Function to calculate the most voted food option name
  const calculateMostVotedOptionName = (votesData: FirebaseFirestoreTypes.DocumentData) => {
    // Implement your logic to calculate the most voted option name from votesData
    // For example, you can iterate through the votes and find the one with the highest count
    // Return the name of the most voted option
    // For now, let's assume the votesData has a structure like { option1: count1, option2: count2, ... }
    const options = Object.keys(votesData);
    let mostVotedOption = options[0];
    let maxCount = votesData[mostVotedOption];
    for (let i = 1; i < options.length; i++) {
      const option = options[i];
      if (votesData[option] > maxCount) {
        mostVotedOption = option;
        maxCount = votesData[option];
      }
    }
    return mostVotedOption;
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        Main food option of the day: {mainFoodOptionName}
      </Text>
    </View>
  );
};

export default HomeScreen;
