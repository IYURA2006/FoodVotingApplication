import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Introduction from './components/IntroductionPage';
import Login from './components/LoginPage';
import Main from './components/Main';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';

const Stack = createStackNavigator();

const InsideStack = createStackNavigator();

function InsideLayout() {
  <InsideStack.Navigator>
    <InsideStack.Screen name="VotingAPP"  component={Main}/>
  </InsideStack.Navigator>
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) =>{
      setUser(user);
    });
  }, []);
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Introduction">
        <Stack.Screen name="Introduction" component={Introduction} /> 
        {user ? <Stack.Screen name='Inside' component={Main} options={{headerShown : true}} />  : <Stack.Screen name='Login' component={Login} options={{headerShown : true}} />}
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
