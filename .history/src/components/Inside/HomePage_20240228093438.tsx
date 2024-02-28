import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';

interface VoteResult {
  selectedOptionName: string;
}

const HomeScreen: React.FC = () => {
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
        const data = doc.data() as VoteResult;
        voteCounts[data.selectedOptionName] = (voteCounts[data.selectedOptionName] || 0) + 1;
      });

      // Find the most voted option
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
    <View style={styles.container}>
      <Text style={styles.title}>Most Voted Food Option Yesterday</Text>
      {mostVotedOption ? (
        <Text style={styles.option}>{mostVotedOption}</Text>
      ) : (
        <Text style={styles.message}>No votes recorded yesterday.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    fontSize: 18,
  },
  message: {
    fontSize: 16,
    color: 'gray',
  },
});

export default HomeScreen;
