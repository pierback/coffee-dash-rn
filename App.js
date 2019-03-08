import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Button,
} from 'react-native';
import {
  payCoffee,
  payMate,
  payWater,
  getChairBalance,
  getOwnBalance,
} from './bchain/cffcn';
import { setDrinkData } from './bchain/bvrglst';
import './bchain/web3Init';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.paycoffee = this.paycoffee.bind(this);
    this.state = {
      chairBalance: '',
      ownBalance: '',
    };
  }

  componentDidMount() {
  }

  paycoffee() {
    payCoffee().then(() => {
      getOwnBalance().then((externalData) => {
        console.log('ownBalance:', externalData);
        this.setState({ ownBalance: externalData });
      });
      getChairBalance().then((externalData) => {
        console.log('chairBalance:', externalData);
        this.setState({ chairBalance: externalData });
      });
    });
    setDrinkData('coffee');
  }

  /* eslint-disable */
  render() {
    return (  
      <View style={styles.container}> 
        {/* <Navigator /> */}
        <Text style={styles.text}>{`Chair Balance:${
          this.state.chairBalance
        }`}</Text>
        <Button
          style={{ height: 100, marginTop: 10 }}
          onPress={this.paycoffee}
          title="Coffee"
          accessibilityLabel="Learn more about this purple button"
        />
        <Text style={styles.text}>{`Own Balance:${
          this.state.ownBalance
        }`}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  text: {
    fontSize: 100,
    textAlign: "center",
    margin: 10,
    marginBottom: 50
  }
});
