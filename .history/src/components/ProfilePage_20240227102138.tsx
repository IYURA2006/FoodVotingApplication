import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, TextInput, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { getAuth, updatePassword } from "firebase/auth";
import { NavigationProp } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

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
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

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

  const handlePasswordChange = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        await updatePassword(user, newPassword)
        Alert.alert('Success', 'Password updated successfully');
        setPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        console.log('User not logged in');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('Error', 'Failed to update password. Please try again.');
    }
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setOptionsVisible(false);
    switch (editableItem) {
      case 'currentYear':
        setCurrentYear(option);
        break;
      case 'house':
        setHouse(option);
        break;
      default:
        break;
    }
  };

  const renderOptionsModal = () => {
    return (
      <Modal visible={optionsVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => handleOptionSelect('Option 1')} style={styles.optionButton}>
              <Text>Option 1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOptionSelect('Option 2')} style={styles.optionButton}>
              <Text>Option 2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOptionSelect('Option 3')} style={styles.optionButton}>
              <Text>Option 3</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setOptionsVisible(false)} style={styles.closeButton}>
              <Text style={{ color: 'blue' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size='large' color='#007BFF' />
      ) : (
        <>
          {userData ? (
            <>
              <Text style={styles.sectionTitle}>Manage Your Profile Information</Text>
              <Text style={styles.sectionSubtitle}>Edit Account</Text>
              <Text style={styles.sectionSubtitle}>About Yourself</Text>
              <Text style={[styles.sectionTitle, styles.userInfo]}>Welcome, {userData.name}</Text>
              <View style={styles.editableItemContainer}>
                <Text style={styles.label}>Surname:</Text>
                {editableItem === 'surname' ? (
                  <TextInput
                    style={styles.input}
                    value={surname}
                    onChangeText={setSurname}
                    placeholder="Surname"
                  />
                ) : (
                  <Text style={styles.text}>{surname}</Text>
                )}
                <Button onPress={() => setEditableItem('surname')} title="Edit" />
              </View>

              <View style={styles.editableItemContainer}>
                <Text style={styles.label}>Date of Birth:</Text>
                {editableItem === 'dateOfBirth' ? (
                  <TextInput
                    style={styles.input}
                    value={dateOfBirth}
                    onChangeText={setDateOfBirth}
                    placeholder="Date of Birth"
                  />
                ) : (
                  <Text style={styles.text}>{dateOfBirth}</Text>
                )}
                <Button onPress={() => setEditableItem('dateOfBirth')} title="Edit" />
              </View>

              <Text style={styles.sectionSubtitle}>Contact Info</Text>
              <Text style={styles.text}>Email: {userData.email}</Text>
              <View style={styles.editableItemContainer}>
                <Text style={styles.label}>Current Year:</Text>
                {editableItem === 'currentYear' ? (
                  <TouchableOpacity onPress={() => setOptionsVisible(true)} style={styles.editableItem}>
                    <Text>{currentYear || 'Select Option'}</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.text}>{currentYear}</Text>
                )}
                <Button onPress={() => setEditableItem('currentYear')} title="Edit" />
              </View>
              <View style={styles.editableItemContainer}>
                <Text style={styles.label}>House:</Text>
                {editableItem === 'house' ? (
                  <TouchableOpacity onPress={() => setOptionsVisible(true)} style={styles.editableItem}>
                    <Text>{house || 'Select Option'}</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.text}>{house}</Text>
                )}
                <Button onPress={() => setEditableItem('house')} title="Edit" />
              </View>

              <Text style={styles.sectionSubtitle}>Change Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Current Password"
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New Password"
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                placeholder="Confirm New Password"
                secureTextEntry
              />
              <Button onPress={handlePasswordChange} title="Change Password" />

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
  editableItem: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  userInfo: {
    color: '#007BFF',
  },
});

export default ProfilePage;