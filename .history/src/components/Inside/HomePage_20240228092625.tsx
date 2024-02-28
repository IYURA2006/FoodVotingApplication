import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SvgXml } from 'react-native-svg'; // Import SvgXml from react-native-svg
import icons from '../../assets/icons/icons';
import { ScrollView } from 'react-native-gesture-handler';

type HomeScreenProps = {
  navigation: StackNavigationProp<{}>; // Define the type of the navigation prop
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => (
  <ScrollView style={{ padding: 30, paddingTop: 40, marginTop:20 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 55,}}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', color:"#079E58"}}>
        Home
      </Text>

      <TouchableOpacity onPress={() => navigation.navigate('Profile' as never)}>
        <SvgXml xml={icons.userSolid} width={32} height={32} />
      </TouchableOpacity>
    </View>

    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
      Introduction
    </Text>

    <Text style={{ fontSize: 16, marginBottom: 16 }}>
      The Waste-Free Lunch App is a user-friendly application that designed
      to revolutionise the way students order and manage their meals in the
      school cafeteria. With a simple and intuitive interface, students can
      easily browse the daily menu, select their preferred meal options. The app provides
      real-time notifications to cafeteria staff. Additionally, the app tracks
      and analyses food waste data, allowing cafeteria management to identify
      patterns and implement strategies to minimise waste. By promoting
      convenience, customisation, and sustainability, the Waste-Free Lunch
      enhances the overall dining experience for students while supporting
      efficient cafeteria operations.
    </Text>

    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
      Main food option of the day:
    </Text>

    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
      Current voting:
    </Text>


   
  </ScrollView>
);

export default HomeScreen;
