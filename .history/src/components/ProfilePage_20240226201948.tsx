import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
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
                {editableItem === 'currentYear' ? (
                  <TextInput
                    style={styles.input}
                    value={currentYear}
                    onChangeText={setCurrentYear}
                    placeholder="Current Year"
                  />
                ) : (
                  <Text style={styles.text}>{currentYear}</Text>
                )}
                <Button onPress={() => setEditableItem('currentYear')} title="Edit" />
              </View>
              <View style={styles.editableItemContainer}>
                <Text style={styles.label}>House:</Text>
                {editableItem === 'house' ? (
                  <TextInput
                    style={styles.input}
                    value={house}
                    onChangeText={setHouse}
                    placeholder="House"
                  />
                ) : (
                  <Text style={styles.text}>{house}</Text>
                )}
                <Button onPress={() => setEditableItem('house')} title="Edit" />
              </View>
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
              <Button onPress={handleUpdateProfile} title="Update Profile" />
            </>
          ) : (
            <Text style={styles.text}>User data not available</Text>
          )}
          <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
        </>
      )}
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
});

export default ProfilePage;
