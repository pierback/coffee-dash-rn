import React from 'react';
import { Header } from 'react-native-elements';

const HeaderComp = () => (
  <Header
    centerComponent={{
      h5: true,
      text: 'Beverage List',
      fontSize: 100,
      style: { color: '#fff', fontSize: 30, marginBottom: 30 },
    }}
  />
);

export default HeaderComp;
