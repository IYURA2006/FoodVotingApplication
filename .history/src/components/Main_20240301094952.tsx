import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SvgXml } from 'react-native-svg'; // Import SvgXml from react-native-svg
import icons from '../assets/icons/icons'; // Import your SVG icons as an object

import HomeScreen from './Inside/HomePage';
import VotingScreen from './Inside/VotingPage';
import ResultsScreen from './Inside/ResultsPage';
import FeedbackScreen from './Inside/FeedbackPage';
import ProfileScreen from './Inside/ProfilePage';
import FoodDetailsPage from './Inside/FoodDetailsPage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let icon;

        if (route.name === 'Home') {
          icon = focused ? icons.houseSolidFocused : icons.houseSolid;
        } else if (route.name === 'Voting') {
          icon = focused ? icons.checkToSlotSolidFocused : icons.checkToSlotSolid;
        } else if (route.name === 'Results') {
          icon = focused ? icons.squarePollVerticalSolidFocused : icons.squarePollVerticalSolid;
        } else if (route.name === 'Feedback') {
          icon = focused ? icons.commentsSolid : icons.commentsSolid;
        }

        return icon ? <SvgXml xml={icon} width={24} height={24} /> : null;
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
    <Stack.Screen name="FoodDetails" component={FoodDetailsPage} />
  </Stack.Navigator>
);

export default Main;
