import React, { useState } from 'react';
import { View, TextInput, Alert, ActivityIndicator, Button, KeyboardAvoidingView, StyleSheet, Text, Image, Pressable } from 'react-native';
import { RootStackParamList } from '../../types';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import RegistrationPage from './RegistrationPage';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        Alert.alert('Sign in failed: ' + err.message);
      } else {
        Alert.alert('Sign in failed: Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/marlborough-college.png/')} />
      <View style={styles.header}>
        <Text style={styles.headerText}>Waste-Free Lunch</Text>
      </View>
      <KeyboardAvoidingView behavior='padding' style={styles.formContainer}>
        <Text style={styles.loginText}>Login To Your School Account</Text>
        <TextInput
          style={styles.input}
          placeholder='College Email'
          autoCapitalize='none'
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder='Password'
          autoCapitalize='none'
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />
        <Text style={styles.createAccountText}>
          Don't have an account? 
          <Pressable onPress={() => navigation.navigate("Registration")}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </Pressable>
        </Text>
        {loading ? (
          <ActivityIndicator size='large' color='#007BFF' style={styles.loader} />
        ) : (
          <Button title='Login' onPress={signIn} color='#007BFF' />
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  formContainer: {
    width: '80%',
    maxWidth: 400,
  },
  loginText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#CED4DA',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  createAccountText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
    textAlign: 'center',
  },
  signUpLink: {
    fontSize: 18,
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  loader: {
    marginTop: 20,
  },
});

export default LoginPage;
