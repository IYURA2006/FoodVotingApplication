import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import WebView from 'react-native-webview';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import icons from '../assets/icons/icons';

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
          const result = data.results[0];
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

  // Define the HTML content with inline CSS to change font size
  const htmlContent = `
    <html>
      <head>
        <style>
          /* Define styles for changing font size */
          body {
            font-size: 50px; /* Change the font size as needed */
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        ${foodDetails.summary}
      </body>
    </html>
  `;

  return (
    <ScrollView style={styles.container}>
      <View  style={styles.header}>  
           <Text style={styles.title}>{foodDetails.title}</Text>
           <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
      </View>
      <View style={styles.contentContainer}>
        
        <View style={styles.imageContainer}>
          <Image source={{ uri: foodDetails.image }} style={styles.image} />
        </View>
        <View style={styles.detailsContainer}>

          <Text style={styles.detail}>Gluten Free: {foodDetails.glutenFree ? 'Yes' : 'No'}</Text>
          <Text style={styles.detail}>Dairy Free: {foodDetails.dairyFree ? 'Yes' : 'No'}</Text>
          <Text style={styles.detail}>Health Score: {foodDetails.healthScore}</Text>
          <Text style={styles.detail}>Vegetarian: {foodDetails.vegetarian ? 'Yes' : 'No'}</Text>
          <Text style={styles.detail}>Vegan: {foodDetails.vegan ? 'Yes' : 'No'}</Text>
          <Text style={styles.detail}>Cuisine: {foodDetails.cuisines ? foodDetails.cuisines.join(', ') : 'Unknown Cuisine'}</Text>
          <Text style={styles.detail}>Intolerances: {foodDetails.intolerances ? foodDetails.intolerances.join(', ') : 'No Intolerances'}</Text>
        </View>
      </View>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webView}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 20,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 30,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
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
  webView: {
    marginVertical: 10,
    minHeight: 450,
  },
});

export default ViewInstructions;
