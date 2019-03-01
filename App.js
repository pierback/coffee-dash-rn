/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator,
} from 'rn-viewpager';
import {
  ButtonGroup,
  Header,
} from 'react-native-elements';
import TabMap from './components/TabMap';
import web3Init from './components/web3Init';
import Loader from './components/Loader';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n'
    + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n'
    + 'Shake or press menu button for dev menu',
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
  },
});


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: '',
      consumption: '',
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          centerComponent={{ text: 'Coffee Mate', style: { color: 'black', fontSize: 25 } }}
          statusBarProps={{ barStyle: 'light-content' }}
          containerStyle={{ backgroundColor: 'white' }}
        />
        {/* <Navigator /> */}
        <TabMap />
        <Loader />
      </View>
    );
  }
}

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginBottom: 50,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
