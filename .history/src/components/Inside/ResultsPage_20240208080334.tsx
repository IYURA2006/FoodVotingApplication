// ResultsPage.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';
import { PieChart } from 'react-native-charts-wrapper';

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
  const data = {
    dataSets: [{
      values: Object.values(voteResults),
      label: 'Voting Results',
      config: {
        colors: ['#C0FF8C', '#FFF78C', '#FFD08C', '#8CEAFF', '#FF8C9D', '#AAAAFF'],
        sliceSpace: 5,
        selectionShift: 13
      }
    }],
  };

  return (
    <View style={styles.container}>
      <PieChart
        style={styles.chart}
        data={data}
        legend={{ enabled: true, textSize: 15, form: 'CIRCLE' }}
        highlights={[{ x: 1 }]}
        chartDescription={{ text: 'Voting Results', textSize: 15 }}
        entryLabelColor={'#fff'}
        entryLabelTextSize={20}
      />
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
  chart: {
    width: 300,
    height: 300,
  },
});

export default ResultsPage;
