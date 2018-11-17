import * as React from 'react';
import {
  ActivityIndicator,
  View,
} from 'react-native';
import {
  Overlay,
} from 'react-native-elements';

const Loader = () => (
  <View>
    <Overlay
      isVisible={global.loading}
      windowBackgroundColor="rgba(255, 255, 255, .5)"
      overlayBackgroundColor="gray"
      width="auto"
      height="auto"
    >
      <ActivityIndicator size="large" color="black" />
    </Overlay>
  </View>
);
export default Loader;
