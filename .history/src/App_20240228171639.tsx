import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './components/LoginPage';
import Registration from './components/RegistrationPage';
import Main from './components/Main';
import WelcomeScreen from './components/WelcomePage';
import HomeScreen from './components/Inside/HomePage';
import VotingScreen from './components/Inside/VotingPage';
import ResultsScreen from './components/Inside/ResultsPage';
import FeedbackScreen from './components/Inside/FeedbackPage';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import ResultsPage from './components/Inside/ResultsPage';
import FoodDetailsPage from './components/Inside/FoodDetailsPage';

const Stack = createStackNavigator();

function InsideLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Voting" component={VotingScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="FoodDetails" component={FoodDetailsPage} />
    </Stack.Navigator>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      // Check if the user is an admin here
      // For example, you can check if the user's email matches a predefined list of admin emails
      if (user && user.email === 'admin@example.com') {
        setIsAdmin(true);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Introduction" screenOptions={{ headerShown: false }}>
        {user ? (
          isAdmin ? ( // If user is admin
            <>
              <Stack.Screen name='AdminMain' component={AdminMain} />
              {/* Add more admin screens here */}
            </>
          ) : (
            <>
              <Stack.Screen name='Inside' component={InsideLayout} />
            </>
          )
        ) : (
          <>
            <Stack.Screen name='WelcomeScreen' component={WelcomeScreen} />
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='Registration' component={Registration} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Separate component for Admin Main Screen and other admin-specific screens
const AdminMain = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminMain" component={Main} />
      {/* Add more admin screens here */}
    </Stack.Navigator>
  );
};

export default App;
