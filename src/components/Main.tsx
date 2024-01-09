import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Inside/HomePage';
import VotingScreen from './Inside/VotingPage';
import ResultsScreen from './Inside/ResultsPage';
import FeedbackScreen from './Inside/FeedbackPage';

import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function Main() {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';
            } else if (route.name === 'Voting') {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            } else if (route.name === 'Results') {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            } else if (route.name === 'Feedback') {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Voting" component={VotingScreen} />
        <Tab.Screen name="Results" component={ResultsScreen} />
        <Tab.Screen name="Feedback" component={FeedbackScreen} />
      </Tab.Navigator>
  );
}
