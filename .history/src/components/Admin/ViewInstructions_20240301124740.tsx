// InstructionPage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ResultsScreenNavigationProp = any

const ViewInstructions: React.FC<ResultsScreenNavigationProp> = ({ route }) => {
  const { foodOption } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{foodOption.title}</Text>
      <Text style={styles.instructions}>{foodOption.instructions}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ViewInstructions;
