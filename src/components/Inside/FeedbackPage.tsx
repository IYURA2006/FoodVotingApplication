import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
  Image,
} from 'react-native';
import {FIREBASE_AUTH, FIRESTORE_DB} from '../../../FirebaseConfig';
import {addDoc, collection} from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import {doc, getDoc} from 'firebase/firestore';

const FeedbackPage = () => {
  const [selectedIssue, setSelectedIssue] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [userData, setUserData] = useState<{name: string} | null>(null);
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
          const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data() as {name: string});
          } else {
            console.log('User data not found in Firestore');
          }
        } else {
          console.log('User not logged in');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const submitFeedback = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;

      // Validation: User should be logged in
      if (!user) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      // Validation: Issue type should be selected
      if (!selectedIssue) {
        Alert.alert('Error', 'Please select an issue type');
        return;
      }

      // Validation: Text area should contain between 25 and 250 characters
      if (feedbackText.length < 25 || feedbackText.length > 250) {
        Alert.alert(
          'Error',
          'Feedback should be between 25 and 250 characters',
        );
        return;
      }

      const feedbackCollectionRef = collection(FIRESTORE_DB, 'feedback');

      const currentDate = new Date(); // Get current date
      const formattedDate = currentDate.toISOString(); //Convert the current date

      await addDoc(feedbackCollectionRef, {
        userName: userData?.name || '',
        issue: selectedIssue,
        feedbackText: feedbackText,
        submissionTime: formattedDate, // Add submission time
      });

      Alert.alert(
        'Thank you!',
        'Your feedback has been submitted successfully.',
      );

      // Reset input fields
      setSelectedIssue('');
      setFeedbackText('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Provide a valuable feedback!</Text>
        <Image
          source={require('../../assets/crest.jpg')}
          style={styles.headerImage}
        />
      </View>
      <Text style={styles.introductionText}>
        Your feedback is crucial in shaping the dining experience of the
        Marlborough college. Whether you have ideas for new food options, want
        to report issues, or simply share your thoughts on your dining hall
        experience, we value every insight you provide.
      </Text>
      <RNPickerSelect
        onValueChange={value => setSelectedIssue(value)}
        items={[
          {label: 'General', value: 'General'},
          {label: 'Bug Report', value: 'Bug Report'},
          {label: 'Feature Request', value: 'Feature Request'},
          {label: 'Food option report', value: 'Food option report'},
        ]}
        value={selectedIssue}
        style={pickerSelectStyles}
      />
      <TextInput
        style={styles.input}
        placeholder="Describe the problem..."
        multiline
        numberOfLines={4}
        onChangeText={text => setFeedbackText(text)}
        value={feedbackText}
      />
      <Text style={styles.characterCounter}>{feedbackText.length}/250</Text>

      <Pressable
        style={styles.button}
        onPress={submitFeedback}
        disabled={isFeedbackSubmitted}>
        <Text style={styles.text}>Submit!</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    width: '60%',
    marginRight: 60,
  },
  headerImage: {
    width: '20%',
    height: '100%',
  },
  introductionText: {
    fontSize: 16,
    marginBottom: 20,
    color: 'black',
    fontFamily: 'sans-serif',
  },
  input: {
    height: 150,
    borderColor: '#727171',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    color: 'black',
    width: '100%',
    backgroundColor: '#F0EFEF',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '80%',
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#00BC65',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  characterCounter: {
    alignSelf: 'flex-end',
    color: '#727171',
    marginBottom: 30,
    marginTop: -20,
    marginRight: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#727171',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#F0EFEF',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#727171',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#F0EFEF',
  },
});

export default FeedbackPage;
