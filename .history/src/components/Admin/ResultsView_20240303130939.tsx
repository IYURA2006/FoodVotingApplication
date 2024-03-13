import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '../../../types'; // Assuming you have a file named 'types.ts' where you define RootStackParamList
import { StackNavigationProp } from '@react-navigation/stack';


type ResultsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ViewInstructions'>;

interface Props {
  navigation: ResultsScreenNavigationProp;
}

interface VoteResult {
  selectedOptionName: string;
}

interface FoodOption {
  id: string;
  name: string;
  image: string;
}




const ResultsPage: React.FC<Props> = ({ navigation }) => {
  const [topOptionsYesterday, setTopOptionsYesterday] = useState<FoodOption[]>([]);
  const [topOptionsToday, setTopOptionsToday] = useState<FoodOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVoteResults();
  }, []);

  const fetchVoteResults = async () => {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];

      // Get yesterday's date
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];

      const votesCollection = collection(FIRESTORE_DB, 'votes');

      // yesterday's votes
      const yesterdayVotesQuery = query(votesCollection, where('voteDate', '==', yesterdayString));
      const yesterdayVotesSnapshot = await getDocs(yesterdayVotesQuery);
      const yesterdayOptions: { [option: string]: number } = {};
      yesterdayVotesSnapshot.forEach((doc) => {
        const data = doc.data() as VoteResult;
        if (data.selectedOptionName in yesterdayOptions) {
          yesterdayOptions[data.selectedOptionName]++;
        } else {
          yesterdayOptions[data.selectedOptionName] = 1;
        }
      });
      const sortedYesterdayOptions = Object.keys(yesterdayOptions).sort((a, b) => yesterdayOptions[b] - yesterdayOptions[a]);
      await fetchFoodOptions(sortedYesterdayOptions.slice(0, 2), setTopOptionsYesterday);

      //  today's votes
      const todayVotesQuery = query(votesCollection, where('voteDate', '==', today));
      const todayVotesSnapshot = await getDocs(todayVotesQuery);
      const todayOptions: { [option: string]: number } = {};
      todayVotesSnapshot.forEach((doc) => {
        const data = doc.data() as VoteResult;
        if (data.selectedOptionName in todayOptions) {
          todayOptions[data.selectedOptionName]++;
        } else {
          todayOptions[data.selectedOptionName] = 1;
        }
      });
      const sortedTodayOptions = Object.keys(todayOptions).sort((a, b) => todayOptions[b] - todayOptions[a]);
      await fetchFoodOptions(sortedTodayOptions.slice(0, 2), setTopOptionsToday);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching vote results:', error);
      setLoading(false);
    }
  };

  const fetchFoodOptions = async (options: string[], setOptions: React.Dispatch<React.SetStateAction<FoodOption[]>>) => {
    const apiKey = '344d206da412479ab23f0d3f2572976d';
    try {
      const fetchedOptions: FoodOption[] = [];
      for (const option of options) {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=1&addRecipeInformation=true&query=${option}&sort=popularity` );
        const data = await response.json();

        // Check if 'results' array exists and is not empty
        if (data.results && data.results.length > 0) {
          const result = data.results[0]; // Get the first result
          fetchedOptions.push({
            id: option,
            name: result.title, // Access the 'title' property from the first result
            image: result.image, // Access the 'image' property from the first result
          });
        } else {
          console.error('No results found for option:', option);
        }
      }
      setOptions(fetchedOptions);

    } catch (error) {
      console.error('Error fetching food options from Spoonacular API:', error);
    }
  };

 const handleViewInstructions = (foodOptionId: string) => {
    navigation.navigate('ViewInstructions', { foodOptionId });
};    


  const renderVoteResults = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    } else {
      return (
        <View>
          <Text>Top options voted yesterday:</Text>
          {topOptionsYesterday.map((option, index) => (
            <View key={index} style={styles.optionContainer}>
              <Text>{option.name}</Text>
              <Image source={{ uri: option.image }} style={styles.image} />
              <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => handleViewInstructions(option.id)}
              >
                <Text style={styles.viewDetailsButtonText}>View Instructions</Text>
              </TouchableOpacity>
            </View>
          ))}
          <Text>Top options voted today:</Text>
          {topOptionsToday.map((option, index) => (
            <View key={index} style={styles.optionContainer}>
              <Text>{option.name}</Text>
              <Image source={{ uri: option.image }} style={styles.image} />
              <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => handleViewInstructions(option.id)}
              >
                <Text style={styles.viewDetailsButtonText}>View Instructions</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voting Results</Text>
      <View style={styles.resultsContainer}>
        {renderVoteResults()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultsContainer: {
    paddingHorizontal: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginLeft: 10,
  },
  viewDetailsButton: {
    backgroundColor: '#1AAB3A',
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDetailsButtonText: {
    color: '#ffffff',
    fontSize: 12,
  },
});

export default ResultsPage;
