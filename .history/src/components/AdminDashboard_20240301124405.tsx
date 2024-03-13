import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SvgXml } from 'react-native-svg'; // Import SvgXml from react-native-svg
import icons from '../assets/icons/icons'; // Import your SVG icons as an object

import FeedbackScreen from './Admin/FeedbackView';
import ResultsScreen from './Admin/ResultsView';
import ViewInstructions from './Admin/ViewInstructions';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let icon;
        
        if (route.name === 'Results') {
          icon = focused ? icons.squarePollVerticalSolidFocused : icons.squarePollVerticalSolid;
        } else if (route.name === 'Feedback') {
          icon = focused ? icons.commentsSolidFocused : icons.commentsSolid;
        }

        return icon ? <SvgXml xml={icon} width={24} height={24} /> : null;
      },
      tabBarActiveTintColor: 'green',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Results" component={ResultsScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Feedback" component={FeedbackScreen} options={{ headerShown: false }} />
  </Tab.Navigator>
);

const AdminDashboard = () => (
  <Stack.Navigator>
    <Stack.Screen name="Menu" component={TabNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="ViewInstructions" component={ViewInstructions} options={{ headerShown: false }} />
  </Stack.Navigator>
);

export default AdminDashboard;
