import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SvgXml } from 'react-native-svg'; 
import { Button, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import icons from '../assets/icons/icons'; 
import FeedbackScreen from './Admin/FeedbackView';
import ResultsScreen from './Admin/ResultsView';
import ViewInstructions from './Admin/ViewInstructions';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Custom header button component for quitting the app
const QuitButton = () => {
  const navigation = useNavigation();
  
  const handleLogout = () => {
    FIREBASE_AUTH.signOut();
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 10 }}>
      <SvgXml xml={icons.quit} width={24} height={24} />
    </TouchableOpacity>
  );
};

const AdminDashboard = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Menu" 
      component={TabNavigator} 
      options={{ 
        headerShown: false,
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
            <QuitButton />
            <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
          </View>
        ),
      }} 
    />
    <Stack.Screen name="ViewInstructions" component={ViewInstructions} options={{ headerShown: false }} />
  </Stack.Navigator>
);

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

export default AdminDashboard;
