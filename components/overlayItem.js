import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Overlay } from 'react-native-elements';

const styles = StyleSheet.create({
  text: {
    fontSize: 70,
    textAlign: 'center',
  },
});

const OverlayItem = ({ isVisible, reloadInterface }) => (
  <Overlay
    isVisible={isVisible}
    onBackdropPress={reloadInterface}
    width={450}
    height={200}
  >
    <Text style={styles.text}>
      Cheers!
      {'\n'}
      ✅
    </Text>
  </Overlay>
);

export default OverlayItem;
