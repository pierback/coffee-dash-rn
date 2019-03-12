/* eslint-disable class-methods-use-this */
/* eslint-disable no-restricted-syntax */
import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Picker,
} from 'react-native';
import { Header, Button, Overlay } from 'react-native-elements';
import {
  payCoffee,
  payMate,
  payWater,
  getChairBalance,
  getOwnBalance,
} from './bchain/cffcn';
import { setDrinkData } from './bchain/bvrglst';
// import './bchain/web3Init';

import NamePicker from './components/picker';
import Drinks from './components/drinks';
import Employes from './components/employes';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };

    this.drinkCoffee = this.drinkCoffee.bind(this);
    this.drinkMate = this.drinkMate.bind(this);
    this.drinkWater = this.drinkWater.bind(this);
    this.drink = this.drink.bind(this);
    this.NamePicker = React.createRef();
    // this.Drinks = React.createRef();
    this.Employes = React.createRef();
  }

  drink() {
    const { selections } = this.state;
    const address = this.NamePicker.current.state.val;
    const { mate, coffee, water } = this.Drinks.current.state.selections;

    mate && this.drinkMate(address);
    coffee && this.drinkCoffee(address);
    water && this.drinkWater(address);

    const sel = Object.keys(selections).reduce((acc, drink) => {
      acc[drink] = false;
      return acc;
    }, {});

    this.setState({ selections: sel, isVisible: true });
    setTimeout(() => this.setState({ isVisible: false }), 6000);
  }

  drinkCoffee(address) {
    payCoffee(address).then(() => {
      console.log('payCoffee: ', payCoffee);
      getOwnBalance(address).then((externalData) => {
        console.log('ownBalance:', externalData);
      });
      getChairBalance().then((externalData) => {
        console.log('chairBalance:', externalData);
      });
    });
    setDrinkData('coffee', address);
  }

  drinkWater(address) {
    payWater(address).then(() => {
      console.log('payWater: ', payWater);
      getOwnBalance(address).then((externalData) => {
        console.log('ownBalance:', externalData);
      });
      getChairBalance().then((externalData) => {
        console.log('chairBalance:', externalData);
      });
    });
    setDrinkData('water', address);
  }

  drinkMate(address) {
    payMate(address).then(() => {
      console.log('payMate: ', payMate);
      getOwnBalance(address).then((externalData) => {
        console.log('ownBalance:', externalData);
      });
      getChairBalance().then((externalData) => {
        console.log('chairBalance:', externalData);
      });
    });
    setDrinkData('mate', address);
  }

  /* eslint-disable */
  render() {
    return (
      <View style={styles.container}>
        <Header
          centerComponent={{
            h5: true,
            text: "Beverage List",
            fontSize: 100,
            style: { color: "#fff", fontSize: 30, marginBottom: 30 }
          }}
        />
        {/* <Drinks ref={this.Drinks}/> */}
        <Employes ref={this.Employes}/>
        {/* <View
          style={{ marginTop: 0, marginBottom: 100, width: 200, height: 20 }}
        >
          <Button
            title="Drink"
            onPress={this.drink}
            titleStyle={styles.button}
          />
        </View> */}
        <Overlay
          isVisible={this.state.isVisible}
          onBackdropPress={() => this.setState({ isVisible: false })}
          width={450}
          height={200}
        >
          <Text style={styles.text}>Cheers!{"\n"}✅</Text>
        </Overlay>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  cards: {
    marginTop: 10,
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    flexDirection: "row",
    marginBottom: 0
  },
  text: {
    fontSize: 70,
    textAlign: "center"
  },
  overlay: {
    width: 150,
    height: 150,
    fontSize: 100
  },
  button: {
    fontSize: 20
  }
});
