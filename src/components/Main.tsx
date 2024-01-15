import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import SvgUri from 'react-native-svg-uri';

import HomeScreen from './Inside/HomePage';
import VotingScreen from './Inside/VotingPage';
import ResultsScreen from './Inside/ResultsPage';
import FeedbackScreen from './Inside/FeedbackPage';
import ProfileScreen from './ProfilePage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconPath;

        if (route.name === 'Home') {
          iconPath = focused ? require('../assets/icons/house-solid.svg') : require('../assets/icons/house-solid.svg');
        } else if (route.name === 'Voting') {
          iconPath = focused ? require('../assets/icons/check-to-slot-solid.svg') : require('../assets/icons/check-to-slot-solid.svg');
        } else if (route.name === 'Results') {
          iconPath = focused ? require('../assets/icons/square-poll-vertical-solid.svg') : require('../assets/icons/square-poll-vertical-solid.svg');
        } else if (route.name === 'Feedback') {
          iconPath = focused ? require('../assets/icons/comments-solid.svg') : require('../assets/icons/comments-solid.svg');
        }

        return <SvgUri width={size} height={size} source={iconPath} />;
      },
      tabBarActiveTintColor: 'green',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Voting" component={VotingScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Results" component={ResultsScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Feedback" component={FeedbackScreen} options={{ headerShown: false }} />
  </Tab.Navigator>
);

const Main = () => (
  <Stack.Navigator>
    <Stack.Screen name="Menu" component={TabNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

export default Main;
