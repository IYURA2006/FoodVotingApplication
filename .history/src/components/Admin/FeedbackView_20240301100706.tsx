import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';

interface Feedback {
  id: string; // Add id field to uniquely identify each feedback
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
        const data = doc.data();
        feedbackArray.push({ id: doc.id, studentName: data.studentName, feedbackText: data.feedbackText });
      });

      setFeedbackData(feedbackArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedback data:', error);
      setLoading(false);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    try {
      const feedbackDocRef = doc(FIRESTORE_DB, 'feedback', id);
      await deleteDoc(feedbackDocRef);
      // Refresh feedback data after deletion
      fetchFeedbackData();
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      'Delete Feedback',
      'Have you sorted out the problem? Are you sure you want to delete the record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => handleDeleteFeedback(id) }
      ]
    );
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
          <TouchableOpacity onPress={() => confirmDelete(feedback.id)} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
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
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FeedbackPage;
