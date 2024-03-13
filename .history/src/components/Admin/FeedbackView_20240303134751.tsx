import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';
import { SvgXml } from 'react-native-svg'; 
import icons from '../../assets/icons/icons'; 

interface Feedback {
  id: string;
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
      // Refresh feedback the page
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
          <View style={styles.feedbackInfo}>
            <Text style={styles.studentName}>{feedback.studentName}</Text>
            <Text style={styles.feedbackText}>{feedback.feedbackText}</Text>
          </View>
          <TouchableOpacity onPress={() => confirmDelete(feedback.id)} style={styles.deleteButton}>
            <SvgXml xml={icons.tick} width={24} height={24} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 30,
  },
  feedbackItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  feedbackInfo: {
    flex: 1,
  },
  studentName: {
    fontWeight: 'bold',
  },
  feedbackText: {
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
});

export default FeedbackPage;