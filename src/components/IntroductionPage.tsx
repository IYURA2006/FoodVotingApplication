// Introduction.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

const Introduction: React.FC = () => {
  return (
    <Swiper showsButtons={false} showsPagination={true}>
      <View style={styles.slide}>
        <Text>Page 1</Text>
      </View>
      <View style={styles.slide}>
        <Text>Page 2</Text>
      </View>
      <View style={styles.slide}>
        <Text>Page 3</Text>
      </View>
      <View style={styles.slide}>
        <Text>Page 4</Text>
      </View>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Introduction;
