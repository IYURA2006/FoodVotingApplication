import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, TextInput, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { NavigationProp } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const ProfilePage = ({ navigation }: RouterProps) => {
  const [userData, setUserData] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState('');
  const [house, setHouse] = useState('');
  const [surname, setSurname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [editableItem, setEditableItem] = useState<string | null>(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
          const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
            setCurrentYear(userDocSnap.data().currentYear);
            setHouse(userDocSnap.data().house);
            setSurname(userDocSnap.data().surname);
            setDateOfBirth(userDocSnap.data().dateOfBirth);
          } else {
            console.log('User data not found in Firestore');
          }
        } else {
          console.log('User not logged in');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
        await updateDoc(userDocRef, {
          currentYear,
          house,
          surname,
          dateOfBirth
        });
        console.log('Profile updated successfully');
      } else {
        console.log('User not logged in');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const renderEditableItem = () => {
    switch (editableItem) {
      case 'currentYear':
        return (
          <RNPickerSelect
            value={currentYear}
            onValueChange={(value) => setCurrentYear(value)}
            items={[
              { label: 'Year 1', value: 'Year 1' },
              { label: 'Year 2', value: 'Year 2' },
              { label: 'Year 3', value: 'Year 3' },
            ]}
          />
        );
      case 'house':
        return (
          <RNPickerSelect
            value={house}
            onValueChange={(value) => setHouse(value)}
            items={[
              { label: 'House 1', value: 'House 1' },
              { label: 'House 2', value: 'House 2' },
              { label: 'House 3', value: 'House 3' },
            ]}
          />
        );
      case 'surname':
        return (
          <TextInput
            style={styles.input}
            value={surname}
            onChangeText={setSurname}
            placeholder="Surname"
          />
        );
      case 'dateOfBirth':
        function renderDatePickerModal(): React.ReactNode {
          throw new Error('Function not implemented.');
        }

        return (
          <View>
            <TouchableOpacity onPress={() => setOptionsVisible(true)}>
              <Text>{dateOfBirth || 'Select Date'}</Text>
            </TouchableOpacity>
            {renderDatePickerModal()}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size='large' color='#007BFF' />
      ) : (
        <>
          {userData ? (
            <>
              <Text style={styles.text}>Welcome, {userData.name}</Text>
              <Text style={styles.text}>Email: {userData.email}</Text>
              <View style={styles.editableItemContainer}>
                <Text style={styles.label}>Current Year:</Text>
                {renderEditableItem()}
                <Button onPress={() => setEditableItem('currentYear')} title="Edit" />
              </View>
              <View style={styles.editableItemContainer}>
                <Text style={styles.label}>House:</Text>
                {renderEditableItem()}
                <Button onPress={() => setEditableItem('house')} title="Edit" />
              </View>
              <View style={styles.editableItemContainer}>
                <Text style={styles.label}>Surname:</Text>
                {renderEditableItem()}
                <Button onPress={() => setEditableItem('surname')} title="Edit" />
              </View>
              <View style={styles.editableItemContainer}>
                <Text style={styles.label}>Date of Birth:</Text>
                {renderEditableItem()}
                <Button onPress={() => setEditableItem('dateOfBirth')} title="Edit" />
              </View>
              <Button onPress={handleUpdateProfile} title="Update Profile" />
            </>
          ) : (
            <Text style={styles.text}>User data not available</Text>
          )}
          <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
        </>
      )}
      {renderOptionsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  editableItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  optionButton: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center',
  },
});

export default ProfilePage;
