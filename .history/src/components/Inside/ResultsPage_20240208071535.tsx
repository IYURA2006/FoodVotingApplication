// ResultsPage.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';
import PieChart from 'react-native-pie-chart';

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

  // Prepare data for the pie chart
  let series: number[] = [];
  if (voteResults) {
    series = Object.values(voteResults);
  }
  const widthAndHeight = 250
  const sliceColor = ['#F44336','#2196F3']

  return (
    <View style={styles.container}>
      <Text style={styles.sectionText}>Voting Results</Text>
      <PieChart
        series={series} widthAndHeight={widthAndHeight} sliceColor={sliceColor}      />
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
});

export default ResultsPage;
