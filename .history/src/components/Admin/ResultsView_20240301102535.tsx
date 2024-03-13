import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';

interface VoteResult {
  selectedOptionName: string;
}

const ResultsPage: React.FC = () => {
  const [topOptionsYesterday, setTopOptionsYesterday] = useState<string[]>([]);
  const [topOptionsToday, setTopOptionsToday] = useState<string[]>([]);
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

      // Query for yesterday's votes
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
      setTopOptionsYesterday(sortedYesterdayOptions.slice(0, 2));

      // Query for today's votes
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
      setTopOptionsToday(sortedTodayOptions.slice(0, 2));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching vote results:', error);
      setLoading(false);
    }
  };

  const renderVoteResults = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    } else {
      return (
        <View>
          <Text>Top options voted yesterday:</Text>
          {topOptionsYesterday.map((option, index) => (
            <Text key={index}>{option}</Text>
          ))}
          <Text>Top options voted today:</Text>
          {topOptionsToday.map((option, index) => (
            <Text key={index}>{option}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultsContainer: {
    paddingHorizontal: 20,
  },
});

export default ResultsPage;
