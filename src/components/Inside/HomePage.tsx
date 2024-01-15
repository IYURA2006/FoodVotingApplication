import React from 'react';
import { View, Text, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type HomeScreenProps = {
  navigation: StackNavigationProp<{}>; // Define the type of the navigation prop
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => (
  <View>
    <Text>Home Screen</Text>
    <Button
      title="Go to Profile &#xf015;" 
      onPress={() => navigation.navigate('Profile' as never)} // Explicitly define the type to avoid the error
    />
  </View>
);

export default HomeScreen;
