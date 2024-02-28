import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SvgXml } from 'react-native-svg';
import icons from '../../assets/icons/icons';
import { ScrollView } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore'; // Import Firestore from '@react-native-firebase/firestore'

type HomeScreenProps = {
  navigation: StackNavigationProp<{}>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [mostVotedDish, setMostVotedDish] = useState<string>('');

  useEffect(() => {
    const fetchMostVotedDish = async () => {
      // Get yesterday's date
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      try {
        const yesterdayFormatted = `${yesterday.getFullYear()}-${(yesterday.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${yesterday.getDate().toString().padStart(2, '0')}`;

        const querySnapshot = await firestore()
          .collection('voting')
          .where('date', '==', yesterdayFormatted)
          .orderBy('votes', 'desc')
          .limit(1)
          .get();

        if (!querySnapshot.empty) {
          const mostVoted = querySnapshot.docs[0].data();
          setMostVotedDish(mostVoted.dish);
        }
      } catch (error) {
        console.error('Error fetching most voted dish:', error);
      }
    };

    fetchMostVotedDish();
  }, []);

  const handleViewDetails = () => {
    // Call FoodSpoontacular API to get details of the most voted dish
    // You can implement this functionality based on your API endpoint
  };

  return (
    <ScrollView style={{ padding: 30, paddingTop: 40, marginTop: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 55 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: "#079E58" }}>
          Home
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate('Profile' as never)}>
          <SvgXml xml={icons.userSolid} width={32} height={32} />
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Introduction
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 16 }}>
        {/* Your introduction text here */}
      </Text>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Main food options of the day:
      </Text>

      {mostVotedDish ? (
        <View>
          <Text>{mostVotedDish}</Text>
          <Button title="View Details" onPress={handleViewDetails} />
        </View>
      ) : (
        <Text>No most voted dish found for yesterday.</Text>
      )}

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Current voting:
      </Text>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        User's preferences:
      </Text>
    </ScrollView>
  );
};

export default HomeScreen;
