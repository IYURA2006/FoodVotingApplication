// InstructionPage.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

type ViewInstructionsProp = any;

const ViewInstructions: React.FC<ViewInstructionsProp> = ({ route }) => {
    const { foodOptionId } = route.params;
    
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Hello</Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    image: {
      width: 200,
      height: 200,
      resizeMode: 'cover',
      marginBottom: 20,
    },
    detail: {
      fontSize: 18,
      marginBottom: 10,
      textAlign: 'center',
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default ViewInstructions;
