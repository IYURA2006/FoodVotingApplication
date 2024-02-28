import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SvgXml } from 'react-native-svg';
import icons from '../../assets/icons/icons';
import { ScrollView } from 'react-native-gesture-handler';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';

type HomeScreenProps = {
  navigation: StackNavigationProp<{}>;
};

interface FoodOption {
  id: string;
  name: string;
  image: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [mostVotedOption, setMostVotedOption] = useState<FoodOption | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMostVotedOptionYesterday();
  }, []);

  const fetchMostVotedOptionYesterday = async () => {
    try {
      const yesterday = getYesterdayDate();
      const votesCollection = collection(FIRESTORE_DB, 'votes');
      const votesQuery = query(votesCollection, where('voteDate', '==', yesterday));
      const votesSnapshot = await getDocs(votesQuery);

      const voteCounts: { [key: string]: number } = {};
      votesSnapshot.forEach((doc) => {
        const data = doc.data() as { selectedOptionName: string };
        voteCounts[data.selectedOptionName] = (voteCounts[data.selectedOptionName] || 0) + 1;
      });

      let maxVotes = 0;
      let mostVoted = '';
      for (const option in voteCounts) {
        if (voteCounts[option] > maxVotes) {
          maxVotes = voteCounts[option];
          mostVoted = option;
        }
      }

      if (mostVoted) {
        const optionDetails = await fetchFoodOptionDetails(mostVoted);
        setMostVotedOption(optionDetails);
      } else {
        console.error('No votes recorded yesterday.');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching most voted option:', error);
      setLoading(false);
    }
  };

  const getYesterdayDate = (): string => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  const fetchFoodOptionDetails = async (query: string): Promise<FoodOption | null> => {
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
          image: recipe.image
        };

        return optionDetails;
      } else {
        console.error('No food options found in the Spoonacular API response.', data);
        return null;
      }
    } catch (error) {
      console.error('Error fetching food options from Spoonacular API:', error);
      return null;
    }
  };


  const handleFoodDetails = (id: string) => {
    // Implement food details navigation or display logic here
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#1AAB3A" />;
  }

  return (
    <ScrollView style={{ padding: 30, paddingTop: 40, marginTop: 20,}}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 55 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: "#079E58" }}>
          Home
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate('Profile' as never)}>
          <SvgXml xml={icons.userSolid} width={32} height={32} />
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Main food option of the day:
      </Text>

      {mostVotedOption ? (

          <View style={styles.foodOptionsContainer}>
            {/* Map over food options and render */}
            <View key={mostVotedOption.id} style={styles.foodOptionBox}>
              <View style={styles.radioButtonContainer}>
                <Text style={styles.title}>{mostVotedOption.name}</Text>
              </View>
              <Image source={{ uri: mostVotedOption.image }} style={styles.image} />
              <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => handleFoodDetails(mostVotedOption.id)}
              >
                <Text style={styles.viewDetailsButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
      ) : (
        <Text>No votes recorded yesterday.</Text>
      )}


<Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        About the program
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 50 }}>
        The Waste-Free Lunch App is a user-friendly application that designed
        to revolutionise the way students order and manage their meals in the
        school cafeteria. With a simple and intuitive interface, students can
        easily browse the daily menu, select their preferred meal options. The app provides
        real-time notifications to cafeteria staff. Additionally, the app tracks
        and analyses food waste data, allowing cafeteria management to identify
        patterns and implement strategies to minimise waste. By promoting
        convenience, customisation, and sustainability, the Waste-Free Lunch
        enhances the overall dining experience for students while supporting
        efficient cafeteria operations.
      </Text>
    </ScrollView>
  );
};
const styles = StyleSheet.create({

  foodOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,

  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    width: 100,
  },
  foodOptionBox: {
    width: '90%',
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

export default HomeScreen;
