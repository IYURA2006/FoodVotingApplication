// InstructionPage.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

type ResultsScreenNavigationProp = any

const ViewInstructions: React.FC<ResultsScreenNavigationProp> = ({ route }) => {
    const { foodOptionId } = route.params;
    const [foodDetails, setFoodDetails] = useState<any>(null);
  
    useEffect(() => {
      const fetchFoodDetails = async () => {
        try {
          const apiKey = '344d206da412479ab23f0d3f2572976d';
          const response = await fetch(`https://api.spoonacular.com/recipes/${foodOptionId}/information?apiKey=${apiKey}`);
  
          const data = await response.json();
          setFoodDetails(data);
        } catch (error) {
          console.error('Error fetching food details from Spoonacular API:', error);
        }
      };
  
      fetchFoodDetails();
    }, [foodOptionId]);
  
    if (!foodDetails) {
      return (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{foodDetails.title}</Text>
        <Image source={{ uri: foodDetails.image }} style={styles.image} />
        <Text style={styles.detail}>Gluten Free: {foodDetails.glutenFree ? 'Yes' : 'No'}</Text>
        <Text style={styles.detail}>Dairy Free: {foodDetails.dairyFree ? 'Yes' : 'No'}</Text>
        <Text style={styles.detail}>Health Score: {foodDetails.healthScore}</Text>
        <Text style={styles.detail}>Vegetarian: {foodDetails.vegetarian ? 'Yes' : 'No'}</Text>
        <Text style={styles.detail}>Vegan: {foodDetails.vegan ? 'Yes' : 'No'}</Text>
        <Text style={styles.detail}>Cuisine: {foodDetails.cuisines ? foodDetails.cuisines.join(', ') : 'Unknown Cuisine'}</Text>
        <Text style={styles.detail}>Intolerances: {foodDetails.intolerances ? foodDetails.intolerances.join(', ') : 'No Intolerances'}</Text>
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
