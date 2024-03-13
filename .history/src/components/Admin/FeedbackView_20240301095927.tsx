import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';

interface Feedback {
  studentName: string;
  feedbackText: string;
}

const FeedbackPage: React.FC = () => {
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const fetchFeedbackData = async () => {
    try {
      const feedbackCollection = collection(FIRESTORE_DB, 'feedback');
      const feedbackSnapshot = await getDocs(feedbackCollection);
      
      const feedbackArray: Feedback[] = [];
      feedbackSnapshot.forEach((doc) => {
        const { studentName, feedbackText } = doc.data();
        feedbackArray.push({ studentName, feedbackText });
      });

      setFeedbackData(feedbackArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedback data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedback</Text>
      {feedbackData.map((feedback, index) => (
        <View key={index} style={styles.feedbackItem}>
          <Text><Text style={styles.label}>Student Name:</Text> {feedback.studentName}</Text>
          <Text><Text style={styles.label}>Feedback:</Text> {feedback.feedbackText}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  feedbackItem: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
});

export default FeedbackPage;
