import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { PieChart } from "react-native-gifted-charts";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';

interface VoteResult {
  selectedOptionName: string;
}

const ResultsPage: React.FC = () => {
  const [voteResults, setVoteResults] = useState<{ value: number; color: string; label: string; text: string; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextDayDate, setNextDayDate] = useState<string>('');
  const [remainingTime, setRemainingTime] = useState<string | null>(null);
  const [optionColors, setOptionColors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchVoteResults();
    fetchNextDayDate();
    calculateRemainingTime();
  }, []);

  const fetchVoteResults = async () => {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0]; 

      const votesCollection = collection(FIRESTORE_DB, 'votes');
      const votesQuery = query(votesCollection, where('voteDate', '==', today));
      const votesSnapshot = await getDocs(votesQuery);

      const results: { value: number; color: string; label: string; text: string; }[] = [];
      const colors: { [key: string]: string } = {};

      votesSnapshot.forEach((doc) => {
        const data = doc.data() as VoteResult;
        const color = getColorForOption(data.selectedOptionName);
        colors[data.selectedOptionName] = color;
        results.push({
          value: 1,
          color: color,
          label: data.selectedOptionName,
          text: '' // Placeholder for the percentage text, which will be calculated later
        });
      });

      // Calculate percentages and update the voteResults array
      const totalVotes = results.length;
      results.forEach((result) => {
        result.text = `${((result.value / totalVotes) * 100).toFixed(2)}%`;
      });

      setVoteResults(results);
      setOptionColors(colors);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vote results:', error);
      setLoading(false);
    }
  };

  const calculateRemainingTime = () => {
    const now = new Date();
    const targetTime = new Date();
    
    // Set the target time to 1 p.m. of the current day
    targetTime.setHours(18, 0, 0, 0);
  
    // If the current time is after the target time, set the target time to 1 p.m. of the next day
    if (now >= targetTime) {
      targetTime.setDate(targetTime.getDate() + 1);
    }
  
    const timeDifference = targetTime.getTime() - now.getTime();
    const hoursRemaining = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  
    setRemainingTime(`${hoursRemaining} hours ${minutesRemaining} minutes`);
  };

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

  const getColorForOption = (optionName: string): string => {
    if (optionColors[optionName]) {
      return optionColors[optionName];
    } else {
      const newColor = generateRandomColor();
      setOptionColors(prevColors => ({ ...prevColors, [optionName]: newColor }));
      return newColor;
    }
  };
  const generateRandomColor = (): string => {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  };

  const handleUpdateChart = () => {
    setLoading(true);
    fetchVoteResults();
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#1AAB3A" />;
  }

  return (
    <View>
      <View
        style={{
          marginVertical: 10,
          marginHorizontal: 30,
          borderRadius: 10,
          paddingVertical: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}>

        <Text style={styles.remainingTimeText}>{remainingTime && `Remaining time: ${remainingTime}`}</Text>
        <Text style={styles.sectionText}>Voting Results</Text>
        <Text style={styles.votingDateText}>
          {nextDayDate && `for ${nextDayDate}`}
        </Text>

        <PieChart
          donut
          showText
          textColor="black"
          innerRadius={70}
          showTextBackground
          textBackgroundColor="black"
          textBackgroundRadius={28}
          data={voteResults}
          focusOnPress
          centerLabelComponent={() => {
            return (
              <View>
                <Text style={{ color: 'white', fontSize: 36 }}>{voteResults.length}</Text>
                <Text style={{ color: 'white', fontSize: 18 }}>Total Votes</Text>
              </View>
            );
          }}
        />

        <View style={styles.legendContainer}>
          {/* Render legends based on options */}
          {voteResults.map((result, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={{
                  height: 18,
                  width: 18,
                  marginRight: 10,
                  borderRadius: 4,
                  backgroundColor: result.color,
                }}
              />
              <Text style={{ color: 'black', fontSize: 16 }}>{result.label}: {result.text}</Text>
            </View>
          ))}
        </View>

        <Button title="Update Chart" onPress={handleUpdateChart} />
      </View>
    </View>
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
  votingDateText :{
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
    fontWeight: '500',
    color: '#727171',
  },
  legendContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
});

export default ResultsPage;
