// InstructionPage.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

type ViewInstructionsProp = any;

const ViewInstructions: React.FC<ViewInstructionsProp> = ({ route }) => {
    const { foodOptionId } = route.params;
    console.log(foodOptionId);
    const [foodDetails, setFoodDetails] = useState<any>(null);
  
    useEffect(() => {
      const fetchFoodDetails = async () => {
        try {
          const apiKey = '344d206da412479ab23f0d3f2572976d';
          const response = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=1&addRecipeInformation=true&query=${foodOptionId}&sort=popularity`
          );
    
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
    
          const data = await response.json();
          console.log(data);
          if (data && data.results && data.results.length > 0) {
            const result = data.results[0]; // Assuming the first result contains the relevant data
            setFoodDetails(result);
          } else {
            throw new Error('No data received from API');
          }
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
