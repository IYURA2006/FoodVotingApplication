import { View, Text, Button } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
    navigation: NavigationProp <any, any>;
}

const Main = ({navigation} : RouterProps) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
    </View>
  )
}

export default Main