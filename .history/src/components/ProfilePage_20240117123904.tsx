import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { NavigationProp } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const ProfilePage = ({ navigation }: RouterProps) => {
  const [userData, setUserData] = useState<any>(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
          const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
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

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size='large' color='#007BFF' />
      ) : (
        <>
          {userData ? (
            <>
              <Text>Welcome, {userData.name}</Text>
              <Text>Email: {userData.email}</Text>
            </>
          ) : (
            <Text>User data not available</Text>
          )}
          <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
        </>
      )}
    </View>
  );
};

export default ProfilePage;
