import React from 'react';
import {
  View,
  ActivityIndicator,
} from 'react-native';

const ActivityComp = () => (
  <View style={{ flex: 3, justifyContent: 'center' }}>
    <ActivityIndicator size={40} color="#0000ff" />
  </View>
);

export default ActivityComp;
