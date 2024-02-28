import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
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
              <Text style={styles.sectionText}>Voting process</Text>

              <Text style={styles.votingDateText}>
                {nextDayDate && `for ${nextDayDate}`}
              </Text>

        <Text
          style={{
            color: 'white',
            fontSize: 32,
            fontWeight: 'bold',
            marginBottom: 12,
          }}>
          Voting Results
        </Text>

        <PieChart
          strokeColor="white"
          strokeWidth={4}
          donut
          data={voteResults}
          innerCircleColor="#414141"
          innerCircleBorderWidth={4}
          innerCircleBorderColor={'white'}
          showValuesAsLabels={true}
          showText
          textSize={18}
          showTextBackground={true}
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
              <Text style={{ color: 'white', fontSize: 16 }}>{result.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ResultsPage;
