import React from 'react';
import { View, Text, Image, StyleSheet, Button, Pressable } from 'react-native';

const WelcomeScreen: React.FC = ({ navigation }: any) => {
  const handleSignIn = () => {
    navigation.navigate('Login'); 
  };

  const handleCreateAccount = () => {
    navigation.navigate('Registration'); 
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/Pattern.png')} style={styles.backgroundImage} />

      <View style={styles.logoContainer}>
        <Image source={require('../assets/application-logo.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>Waste-Free Lunch</Text>
      <Text style={styles.text}>Welcome to our innovative application dedicated to tackling food waste! Join us in making a positive impact on the world.</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonSignIn}>
          <Button  title="Sign In" onPress={handleSignIn} color='#FFFFFF' />
        </View>
        <Pressable onPress={handleCreateAccount}>
          <Text style={styles.createAccountText}>Don't have an account? Create one!</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative', 
  },
  backgroundImage: {
    position: 'absolute',
    top: 15,
    left: 0,
    width: '100%',
    height: '35%',
    resizeMode: 'cover',
  },
  logoContainer: {
    marginTop: '25%',
    width: '80%',
    height: '20%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    marginTop: '10%',
    fontSize: 24,
    fontWeight: '700',
    color: "#1AAB3A",
  },
  text: {
    marginTop: '3%',
    fontSize: 18,
    marginHorizontal: 25,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '400',
    color: '#727171',
  },
  buttonContainer: {
    width: '80%',
    maxWidth: 400,
    marginTop: 60,
  },
  createAccountText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007BFF',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  buttonSignIn: {
    backgroundColor: '#28A745',
    borderRadius: 15,
    paddingVertical: 5,
  },
});

export default WelcomeScreen;
