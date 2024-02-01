import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, Alert, ScrollView } from 'react-native';
import { getDocs, collection, addDoc, getDoc, doc } from 'firebase/firestore';
import {FIREBASE_AUTH, FIRESTORE_DB} from '../../../FirebaseConfig';
import { RadioButton } from 'react-native-paper';

interface FoodOption {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  intolerances: string;
  glutenFree: boolean;
  dairyFree: boolean;
  healthScore: number;
  vegetarian: boolean;
  vegan: boolean;
}

const VotingPage: React.FC = () => {
  const [foodOptions, setFoodOptions] = useState<FoodOption[]>([]);
  const [selectedFoodOptions, setSelectedFoodOptions] = useState<FoodOption[]>([]);
  const [selectedVotes, setSelectedVotes] = useState<string[]>([]);
  const [remainingTime, setRemainingTime] = useState<string | null>(null);
  const [userData, setUserData] = useState<{name: string} | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
          const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data() as {name: string});
          } else {
            console.log('User data not found in Firestore');
          }
        } else {
          console.log('User not logged in');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchFoodOptionsFromFirestore = async () => {
      try {
        const foodOptionsCollection = collection(FIRESTORE_DB, 'foodOptions');
        const foodOptionsSnapshot = await getDocs(foodOptionsCollection);

        const foodOptionsData = foodOptionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: (doc.data() as { foodName: string }).foodName,
          image: '',
          cuisine: '',
          intolerances: '',
          glutenFree: false,
          dairyFree: false,
          healthScore: 0,
          vegetarian: false,
          vegan: false,
        }));
        setFoodOptions(foodOptionsData);
      } catch (error) {
        console.error('Error fetching food options from Firestore:', error);
      }
    };

    fetchFoodOptionsFromFirestore();
  }, []);

  useEffect(() => {
    if (selectedFoodOptions.length === 0) {
      fetchRandomFoodOptions();
    }
  }, [selectedFoodOptions]);

  const fetchRandomFoodOptions = () => {
    if (foodOptions.length > 0) {
      const selectedFoodOptionIds = new Set<string>();
      const randomFoodOptions: FoodOption[] = [];

      while (randomFoodOptions.length < 4) {
        const shuffledFoodOptions = [...foodOptions].sort(() => Math.random() - 0.5);
        const selectedFoodOption = shuffledFoodOptions.find(
          (option) => !selectedFoodOptionIds.has(option.id)
        );

        if (selectedFoodOption) {
          randomFoodOptions.push(selectedFoodOption);
          selectedFoodOptionIds.add(selectedFoodOption.id);
        }
      }

      console.log('Random Food Options:', randomFoodOptions);

      randomFoodOptions.forEach((randomFoodOption) => {
        fetchFoodOptionsSpoonacular(randomFoodOption.name);
      });
    }
  };

  const fetchFoodOptionsSpoonacular = async (query: string) => {
    try {
      const apiKey = '344d206da412479ab23f0d3f2572976d';
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=1&addRecipeInformation=true&query=${query}&sort=popularity`
      );

      const data = await response.json();

      if (data && data.results && data.results.length > 0) {
        const recipe = data.results[0];

        const optionDetails: FoodOption = {
          id: recipe.id.toString(),
          name: recipe.title,
          image: recipe.image,
          cuisine: recipe.cuisines ? recipe.cuisines.join(', ') : 'Unknown Cuisine',
          intolerances: recipe.intolerances ? recipe.intolerances.join(', ') : 'No Intolerances',
          glutenFree: recipe.glutenFree || false,
          dairyFree: recipe.dairyFree || false,
          healthScore: recipe.healthScore || 0,
          vegetarian: recipe.vegetarian || false,
          vegan: recipe.vegan || false,
        };

        setSelectedFoodOptions((prevOptions) => [...prevOptions, optionDetails]);
      } else {
        console.error('No food options found in the Spoonacular API response.', data);
      }
    } catch (error) {
      console.error('Error fetching food options from Spoonacular API:', error);
    }
  };

  useEffect(() => {
    const calculateRemainingTime = () => {
      const now = new Date();
      const targetTime = new Date();
      targetTime.setHours(13, 0, 0, 0); // 1 p.m. of the current day

      if (now < targetTime) {
        const timeDifference = targetTime.getTime() - now.getTime();
        const hoursRemaining = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

        setRemainingTime(`${hoursRemaining} hours ${minutesRemaining} minutes`);
      } else {
        // If the target time has already passed for today
        setRemainingTime('0 hours 0 minutes');
      }
    };

    const timerInterval = setInterval(calculateRemainingTime, 60000); // Update every minute

    calculateRemainingTime(); // Initial calculation

    return () => clearInterval(timerInterval); // Cleanup on unmount
  }, []);

  const handleVoteChange = (foodOptionId: string) => {
    setSelectedVotes([foodOptionId]);
  };

  const handleVoteSubmit = async () => {
    if (selectedVotes.length === 0) {
      Alert.alert('Please select a food option before submitting your vote.', '', [{ text: 'OK' }]);
      return;
    }

    const selectedOptionId = selectedVotes[0];
    const selectedOption = selectedFoodOptions.find((option) => option.id === selectedOptionId);
    const user = FIREBASE_AUTH.currentUser;

    console.log(user); 
    if (selectedOption) {
      try {
        const now = new Date();
        const voteData = {
          selectedOptionName: selectedOption.name,
          selectedOptionId: selectedOption.id,
          userName: userData?.name || 'Unknown User',
          voteDate: now.toISOString(),
        };

        // Update Firestore with the vote data
        const docRef = await addDoc(collection(FIRESTORE_DB, 'votes'), voteData);

        console.log('Vote submitted:', voteData);

        // Clear selected votes
        setSelectedVotes([]);

        Alert.alert('Thank you for voting!', '', [{ text: 'OK' }]);
      } catch (error) {
        console.error('Error updating Firestore with vote:', error);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <Text style={styles.remainingTimeText}>{remainingTime && `Remaining time: ${remainingTime}`}</Text>
      <Text style={styles.sectionText}>Voting process</Text>
      <Text style={styles.instructionText}>Choose one food option:</Text>
      <View style={styles.foodOptionsContainer}>
        {selectedFoodOptions.map((foodOption) => (
          <View key={foodOption.id} style={styles.foodOptionBox}>
            <View style={styles.radioButtonContainer}>
              <RadioButton
                value={foodOption.id}
                status={selectedVotes.includes(foodOption.id) ? 'checked' : 'unchecked'}
                onPress={() => handleVoteChange(foodOption.id)}
              />
              <Text style={styles.title}>{foodOption.name}</Text>
            </View>
            <Image source={{ uri: foodOption.image }} style={styles.image} />
          </View>
        ))}
      </View>
      <Button
        title="Submit Vote"
        onPress={handleVoteSubmit}
        disabled={selectedVotes.length === 0}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  remainingTimeText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    width: 100,
  },
  foodOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  foodOptionBox: {
    width: '48%',
    padding: 10,
    marginBottom: 10,
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0', // Change background color as needed
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButton: {
    marginTop: 16,
  },
});

export default VotingPage;