import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SvgXml } from 'react-native-svg';
import icons from '../../assets/icons/icons';
import { ScrollView } from 'react-native-gesture-handler';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';

type HomeScreenProps = {
  navigation: StackNavigationProp<{}>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [mostVotedOption, setMostVotedOption] = useState<string | null>(null);
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

      setMostVotedOption(mostVoted);
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

  if (loading) {
    return <ActivityIndicator size="large" color="#1AAB3A" />;
  }

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

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Main food option of the day:
      </Text>

      {mostVotedOption ? (
        <Text style={{ fontSize: 18 }}>{mostVotedOption}</Text>
      ) : (
        <Text>No votes recorded yesterday.</Text>
      )}
    </ScrollView>
  );
};

export default HomeScreen;
