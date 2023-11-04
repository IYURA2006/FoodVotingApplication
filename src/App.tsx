
import {
 
  Text,
 
} from 'react-native';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Introduction from './components/IntroductionPage';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Introduction">
        <Stack.Screen name="Introduction" component={Introduction} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
