import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, Alert, ScrollView, TouchableOpacity } from 'react-native';
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
  const [nextDayDate, setNextDayDate] = useState<string>('');

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
    if (selectedFoodOptions.length === 0 && foodOptions.length > 0) {
      fetchRandomFoodOptions();
    }
  }, [selectedFoodOptions, foodOptions]);

  const fetchRandomFoodOptions = () => {
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

  useEffect(() => {
    const fetchNextDayDate = () => {
      const now = new Date();
      const nextDay = new Date(now);
      nextDay.setDate(now.getDate() + 1);

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };

      setNextDayDate(nextDay.toLocaleDateString(undefined, options));
    };

    fetchNextDayDate();
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

  const handleFoodDetails = (foodOptionId: string) => {
    console.log(`View details for food option with ID: ${foodOptionId}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer} style={{ marginTop: 20 }}>
      <Text style={styles.remainingTimeText}>{remainingTime && `Remaining time: ${remainingTime}`}</Text>
      <Text style={styles.sectionText}>Voting process</Text>

      <Text style={styles.votingDateText}>
        {nextDayDate && `for ${nextDayDate}`}
      </Text>
      
      <Text style={styles.instructionText}>Choose one food option:</Text>
      <View style={styles.foodOptionsContainer}>
        {selectedFoodOptions.map((foodOption) => (
          <View key={foodOption.id} style={styles.foodOptionBox}>
            <View style={styles.radioButtonContainer}>
              <TouchableOpacity
                style={[styles.radioButtonStyling, { borderColor: selectedVotes.includes(foodOption.id) ? '#01AF5E' : '#666' }]}
                onPress={() => handleVoteChange(foodOption.id)}
              >
                {selectedVotes.includes(foodOption.id) && <View style={styles.radioButtonInner} />}
              </TouchableOpacity>
              <Text style={styles.title}>{foodOption.name}</Text>
            </View>
            <Image source={{ uri: foodOption.image }} style={styles.image} />
            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={() => handleFoodDetails(foodOption.id)}
            >
              <Text style={styles.viewDetailsButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
 
 <TouchableOpacity
            style={[styles.submitButton]}
            onPress={() => {
              handleVoteSubmit();
            }}
          >
            <Text style={styles.submitButtonText}>Submit Vote</Text>
          </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    alignItems: 'flex-start',
    padding: 20,
  },
  remainingTimeText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
    color: '#01AF5E',
    fontWeight: '500',
  },
  sectionText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '700',
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
    borderColor: 'rgba(0, 0, 0)',
    borderWidth: 2,
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
  votingDateText :{
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
    fontWeight: '500',
    color: '#727171',
  },
  submitButton: {
    backgroundColor: '#1AAB3A',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom:40,
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  radioButtonStyling: {
    width: 24,
    flexDirection: 'row',
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#01AF5E',
  },
  viewDetailsButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#1AAB3A',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDetailsButtonText: {
    color: '#ffffff',
    fontSize: 12,
  },
});

export default VotingPage;

