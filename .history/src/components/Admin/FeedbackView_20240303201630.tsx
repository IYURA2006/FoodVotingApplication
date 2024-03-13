import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {collection, getDocs, deleteDoc, doc} from 'firebase/firestore';
import {FIREBASE_AUTH, FIRESTORE_DB} from '../../../FirebaseConfig';
import {SvgXml} from 'react-native-svg';
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
      feedbackSnapshot.forEach(doc => {
        const data = doc.data();
        feedbackArray.push({
          id: doc.id,
          studentName: data.studentName,
          feedbackText: data.feedbackText,
        });
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
        {text: 'Cancel', style: 'cancel'},
        {text: 'Yes', onPress: () => handleDeleteFeedback(id)},
      ],
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
      <View style={styles.header}>
        <Text style={styles.title}>Students' Feedbacks</Text>
        <TouchableOpacity onPress={() => FIREBASE_AUTH.signOut()}>
          <SvgXml xml={icons.quit} width={24} height={24} />
        </TouchableOpacity>
      </View>

      {feedbackData.map((feedback, index) => (
        <View key={index} style={styles.feedbackItem}>
          <View style={styles.feedbackContent}>
            <Text>
              <Text style={styles.label}>Student Name:</Text>{' '}
              {feedback.studentName}
            </Text>
            <Text>
              <Text style={styles.label}>Feedback:</Text>{' '}
              {feedback.feedbackText}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => confirmDelete(feedback.id)}
            style={styles.deleteButton}>
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
    padding: 22,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 30,
    paddingTop: -10,
    color: 'green',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feedbackItem: {
    marginBottom: 10,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
  },
  feedbackContent: {
    flex: 1, 
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  deleteButton: {
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
});

export default FeedbackPage;
