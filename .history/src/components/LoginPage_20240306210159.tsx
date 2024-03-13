import React, { useState } from 'react';
import {
  View,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  Pressable,
  Switch,
  Image,
  Dimensions,
} from 'react-native';
import { RootStackParamList } from '../../types';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import RegistrationPage from './RegistrationPage';
import { sendPasswordResetEmail } from 'firebase/auth';

const { width } = Dimensions.get('window');

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const auth = FIREBASE_AUTH;
  

  const signIn = async () => {
    if (!email || !password) {
      Alert.alert('Please enter both email and password');
      return;
    }

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

  const handlePress = () => {
    // Handle button press animation logic here
    console.log('Button Pressed');
  };

  const forgotPassword = async () => {
    if (!email) {
      Alert.alert('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error('Password reset failed:', error);
      if (error instanceof Error) {
        Alert.alert('Password reset failed: ' + error.message);
      } else {
        Alert.alert('Password reset failed: Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.arrowBack}>&#8592;</Text>
        </Pressable>
        <Text style={styles.headerText}>Welcome {'\n'} back!</Text>
      </View>
      <Image source={require('../assets/login_signup_image.png')} style={styles.foodImage} />
      <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
        <Text style={styles.loginText}>Login To Your School Account</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="College Email"
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            autoCapitalize="none"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.showHideButton}>
            <Text style={styles.showHideText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </Pressable>
        </View>
        <View style={styles.rememberMeContainer}>
          <Text style={styles.rememberMeText}>Remember Me</Text>
          <Switch
            value={rememberMe}
            onValueChange={(newValue) => setRememberMe(newValue)}
            trackColor={{ false: '#767577', true: '#1AAB3A' }}
            thumbColor={rememberMe ? '#ffffff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
        ) : (
          <TouchableOpacity
            style={[styles.loginButton, { width: width * 0.8 }]}
            onPress={() => {
              signIn();
              handlePress();
            }}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        )}

        <View style={styles.additionalHelp}>
          <Text style={styles.forgotPasswordLink}>
            <Pressable onPress={() => console.log('Forgot Password pressed')}>
              <Text>Forgot Password?</Text>
            </Pressable>
          </Text>

          <Text style={styles.createAccountLink}>
            <Pressable onPress={() => navigation.navigate('Registration')}>
              <Text>Sign Up</Text>
            </Pressable>
          </Text>
        </View>
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
    marginLeft: -170,
    marginTop: 0,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 34,
    fontWeight: '600',
    color: '#1AAB3A',
    marginLeft: 10,
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
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#CED4DA',
    marginBottom: 20,
  },
  input: {
    height: 40,
    padding: 10,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#CED4DA',
  },
  showHideText: {
    marginLeft: 10,
    color: '#007BFF',
  },
  rememberMeContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rememberMeText: {
    fontSize: 16,
    color: '#555',
  },
  forgotPasswordLink: {
    fontSize: 16,
    color: '#007BFF',
    textDecorationLine: 'underline',
    textAlign: 'right',
    marginBottom: 20,
  },
  createAccountLink: {
    fontSize: 16,
    color: '#007BFF',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  loader: {
    marginTop: 20,
  },
  showHideButton: {
    position: 'absolute',
    right: 0,
    bottom: 12,
  },
  arrowBack: {
    fontSize: 40,
    fontWeight: '600',
    color: '#079829',
    marginLeft: 5,
    marginBottom: 15,
  },
  foodImage: {
    width: 350,
    height: 250,
    resizeMode: 'cover',
    position: 'absolute',
    top: -60,
    right: -100,
  },
  additionalHelp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loginButton: {
    backgroundColor: '#1AAB3A',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom:40,
    marginTop: 30,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default LoginPage;
