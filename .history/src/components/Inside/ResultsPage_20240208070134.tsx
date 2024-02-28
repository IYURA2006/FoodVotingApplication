// ResultsPage.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';

const ResultsPage = () => {
  const [voteResults, setVoteResults] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoteResults = async () => {
      try {
        const now = new Date();
        const today = now.toISOString().split('T')[0]; 

        const votesCollection = collection(FIRESTORE_DB, 'votes');
        const votesQuery = query(votesCollection, where('voteDate', '==', today));
        const votesSnapshot = await getDocs(votesQuery);

        let results: { [key: string]: number } = {};

        votesSnapshot.forEach((doc) => {
          const data = doc.data();
          const selectedOptionName = data.selectedOptionName;

          if (results[selectedOptionName]) {
            results[selectedOptionName]++;
          } else {
            results[selectedOptionName] = 1;
          }
        });

        setVoteResults(results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vote results:', error);
        setLoading(false);
      }
    };

    fetchVoteResults();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1AAB3A" />
      </View>
    );
  }

  // Calculate total number of votes
  const totalVotes = Object.values(voteResults).reduce((acc, curr) => acc + curr, 0);

  // Calculate percentage of votes for each food option
  const votePercentages: { [key: string]: number } = {};
  for (const foodOption in voteResults) {
    votePercentages[foodOption] = (voteResults[foodOption] / totalVotes) * 100;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionText}>Voting Results</Text>
      <View style={styles.pieContainer}>
        {Object.entries(votePercentages).map(([foodOption, percentage]) => (
          <View key={foodOption} style={styles.sliceContainer}>
            <View style={[styles.slice, { transform: [{ rotate: `${percentage * 3.6}deg` }] }]} />
            <Text style={styles.label}>{foodOption}</Text>
            <Text style={styles.value}>{percentage.toFixed(2)}%</Text>
          </View>
        ))}
      </View>
      <Text style={styles.totalVotesText}>Total Votes: {totalVotes}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  pieContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  sliceContainer: {
    alignItems: 'center',
  },
  slice: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#000',
    borderLeftWidth: 50,
    borderLeftColor: 'transparent',
    borderRightWidth: 50,
    borderRightColor: 'transparent',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    color: '#777',
  },
  totalVotesText: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default ResultsPage;
