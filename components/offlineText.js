import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
} from 'react-native';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width, /*
    position: 'absolute',
    top: 30, */
  },
  offlineText: { color: '#fff' },
});

const OfflineText = () => (
  <View style={styles.offlineContainer}>
    <Text style={styles.offlineText}>No Internet Connection</Text>
  </View>
);

export default OfflineText;
