import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SvgXml } from 'react-native-svg'; 
import { TouchableOpacity } from 'react-native'; // Import TouchableOpacity for the quit button
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import icons from '../assets/icons/icons'; 

import FeedbackScreen from './Admin/FeedbackView';
import ResultsScreen from './Admin/ResultsView';
import ViewInstructions from './Admin/ViewInstructions';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Custom header button component for quitting the app
const QuitButton = () => {
  const navigation = useNavigation();
  
  const handleQuit = () => {
    // Perform any action before quitting, such as logging out
    // Then exit the app
    navigation.navigate('Login'); // Navigate to the login screen or any other screen you want to show after quitting
  };

  return (
    <TouchableOpacity onPress={handleQuit}>
      {/* Use your SVG icon for the quit button */}
      <SvgXml xml={icons.quit} width={24} height={24} />
    </TouchableOpacity>
  );
};

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
    <Stack.Screen 
      name="Menu" 
      component={TabNavigator} 
      options={{ 
        headerShown: false,
        headerRight: () => <QuitButton />, // Add the quit button to the header
      }} 
    />
    <Stack.Screen name="ViewInstructions" component={ViewInstructions} options={{ headerShown: false }} />
  </Stack.Navigator>
);

export default AdminDashboard;
