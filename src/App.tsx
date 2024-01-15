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


const Stack = createStackNavigator();


function InsideLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="VotingAPP" component={Main}  options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Introduction" screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name='Inside' component={InsideLayout}  />
            <Stack.Screen name='Results' component={ResultsPage}  />
          </>
        ) : (
          <>
            <Stack.Screen name='WelcomeScreen' component={WelcomeScreen}  />
            <Stack.Screen name='Login' component={Login}  />
            <Stack.Screen name='Registration' component={Registration} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
