import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Introduction from './components/IntroductionPage';
import Login from './components/LoginPage';
import Registration from './components/RegistrationPage';  // Import the RegistrationPage component
import Main from './components/Main';
import WelcomeScreen from './components/WelcomePage';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';

const Stack = createStackNavigator();

function InsideLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="VotingAPP" component={Main} />
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
      <Stack.Navigator initialRouteName="Introduction">
        {user ? (
          <Stack.Screen name='Inside' component={InsideLayout} options={{ headerShown: true }} />
        ) : (
          <>
            <Stack.Screen name='WelcomeScreen' component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
            <Stack.Screen name='Registration' component={Registration} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    
    </NavigationContainer>
  );
}

export default App;
