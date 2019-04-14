import React from 'react';
import { View } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';

const HeaderComp = ({ visible, goBack }) => (
  <View style={{ alignSelf: 'stretch' }}>
    <Header
      centerComponent={{
        h5: true,
        text: 'Beverage List',
        style: { color: '#fff', fontSize: 30, marginBottom: 30 },
      }}
      leftComponent={
        visible ? (
          <Icon
            name="arrowleft"
            type="AntDesign"
            size={30}
            color="white"
            style={{
              paddingLeft: 30,
              paddingRight: 80,
              paddingBottom: 50,
              paddingTop: 50,
              marginBottom: 20,
            }}
            onPress={goBack}
          />
        ) : null
      }
    />
  </View>
);

export default HeaderComp;
