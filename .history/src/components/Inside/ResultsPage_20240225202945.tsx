import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { PieChart } from "react-native-gifted-charts";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';

interface VoteResult {
  selectedOptionName: string;
}

const ResultsPage: React.FC = () => {
  const [voteResults, setVoteResults] = useState<{ value: number; color: string; label: string; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextDayDate, setNextDayDate] = useState<string>('');
  const [remainingTime, setRemainingTime] = useState<string | null>(null);

  const pieData = [
    {value: 54, color: '#177AD5', text: '54%'},
    {value: 30, color: '#79D2DE', text: '30%'},
    {value: 26, color: '#ED6665', text: '26%'},
  ];

  useEffect(() => {
    const fetchVoteResults = async () => {
      try {
        const now = new Date();
        const today = now.toISOString().split('T')[0]; 

        const votesCollection = collection(FIRESTORE_DB, 'votes');
        const votesQuery = query(votesCollection, where('voteDate', '==', today));
        const votesSnapshot = await getDocs(votesQuery);

        const results: { value: number; color: string; label: string; }[] = [];

        votesSnapshot.forEach((doc) => {
          const data = doc.data() as VoteResult;
          results.push({
            value: 1,
            color: getColorForOption(data.selectedOptionName),
            label: data.selectedOptionName,
          });
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

  useEffect(() => {
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

    const timerInterval = setInterval(calculateRemainingTime, 60000); // Update every minute

    calculateRemainingTime(); // Initial calculation

    return () => clearInterval(timerInterval); // Cleanup on unmount
  }, []);

  useEffect(() => {
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

    fetchNextDayDate();
  }, []);

  const getColorForOption = (optionName: string): string => {
    // Provide color based on option name or any other logic you have
    switch (optionName) {
      case 'Option 1':
        return 'rgb(84,219,234)';
      case 'Option 2':
        return 'lightgreen';
      case 'Option 3':
        return 'orange';
      default:
        return 'grey';
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#1AAB3A" />;
  }

  return (
    <View>
      <View
        style={{
          marginVertical: 100,
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
          textBackgroundColor="white"
          textBackgroundRadius={22}
          data={pieData}
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

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 20,
          }}>
          {/* Render legends based on options */}
          {voteResults.map((result, index) => (
            <View key={index}>
              <View
                style={{
                  height: 18,
                  width: 18,
                  marginRight: 10,
                  borderRadius: 4,
                  backgroundColor: result.color,
                }}
              />
              <Text style={{ color: 'black', fontSize: 16 }}>{result.label}</Text>
            </View>
          ))}
        </View>

    
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
});

export default ResultsPage;
