import React, { useState } from 'react';
import { View, TextInput, Alert, Button, KeyboardAvoidingView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface RegistrationPageProps {
  navigation: any; 
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const firestore = FIRESTORE_DB;

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(firestore, 'users', response.user.uid), {
        name: name,
        email: email,
      });

      console.log(response);
      Alert.alert('Check your emails');

    } catch (err: any) {
      console.error(err);
      Alert.alert('Sign up failed', err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior='padding' style={styles.formContainer}>
        <Text style={styles.headerText}>Create an Account</Text>
        <TextInput
          style={styles.input}
          placeholder='Your name'
          autoCapitalize='none'
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder='Email'
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
         <TextInput
          style={styles.input}
          placeholder='Repeat your password'
          autoCapitalize='none'
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />
        {loading ? (
          <ActivityIndicator size='large' color='#007BFF' style={styles.loader} />
        ) : (
          <Button title='Create Account' onPress={signUp} color='#28A745' />
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
  formContainer: {
    width: '80%',
    maxWidth: 400,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007BFF',
  },
  input: {
    height: 40,
    borderColor: '#CED4DA',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  loader: {
    marginTop: 20,
  },
});

export default RegistrationPage;
