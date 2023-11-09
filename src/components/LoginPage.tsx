import { View, TextInput, Alert, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React, {useState} from 'react'
import {FIREBASE_AUTH} from "../../FirebaseConfig"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const responce = await signInWithEmailAndPassword(auth, email, password)
            console.log(responce);
        } catch (err: any) {
            console.log(err);
            Alert.alert('Sing in failed: ' + err.message)
        } finally {
            setLoading(false);
        };
    }

    const signUp= async () => {
        setLoading(true);
        try {
            const responce = await createUserWithEmailAndPassword(auth, email, password)
            console.log(responce);
            Alert.alert('Check your emails')
        } catch (err: any) {
            console.log(err);
            Alert.alert('Sign in failed: ' + err.message);
        } finally {
            setLoading(false);
        };
    }
  return (
    <View>
      <KeyboardAvoidingView behavior='padding'>
      <TextInput placeholder='Email' autoCapitalize='none' onChangeText={(text)=> setEmail(text)}></TextInput>
      <TextInput placeholder='Password' autoCapitalize='none' onChangeText={(text)=> setPassword(text)} secureTextEntry={true}></TextInput>

      {loading ? (<ActivityIndicator size = 'large' color = "fff" />

      ) : (
        <>
            <Button title="Login" onPress={signIn} />
            <Button title="Create account" onPress={signUp} />
        </>
    )}
    </KeyboardAvoidingView>
    </View>
  )
}

export default LoginPage