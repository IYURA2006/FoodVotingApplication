import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { FIRESTORE_DB } from '../../../FirebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';

const FeedbackPage = () => {
  const [selectedIssue, setSelectedIssue] = useState('General');
  const [feedbackText, setFeedbackText] = useState('');

  const submitFeedback = async () => {
    try {
      const feedbackCollectionRef = collection(FIRESTORE_DB, 'feedback');
      const feedbackDocRef = await addDoc(feedbackCollectionRef, {
        issue: selectedIssue,
        feedbackText: feedbackText,
      });

      console.log('Feedback submitted with ID:', feedbackDocRef.id);
      // You can add additional logic here, such as displaying a success message
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // You can handle errors and display an error message
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Feedback Page</Text>
      <RNPickerSelect
        onValueChange={(value) => setSelectedIssue(value)}
        items={[
          { label: 'General', value: 'General' },
          { label: 'Bug Report', value: 'Bug Report' },
          { label: 'Feature Request', value: 'Feature Request' },
          // Add more issue types as needed
        ]}
        value={selectedIssue}
        style={pickerSelectStyles}
      />
      <TextInput
        style={styles.input}
        placeholder="Describe the problem..."
        multiline
        numberOfLines={4}
        onChangeText={(text) => setFeedbackText(text)}
      />
      <Button title="Submit Feedback" onPress={submitFeedback} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 20,
    width: '100%',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 20,
    width: '100%',
  },
});

export default FeedbackPage;
