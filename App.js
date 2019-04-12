/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ActivityIndicator,
} from 'react-native';
import { Overlay } from 'react-native-elements';
import { payCoffee, payMate, payWater } from './bchain/cffcn';
import { setDrinkData } from './bchain/bvrglst';
import { checkNewDeployment, initWeb3 } from './bchain/web3Init';
import EmpContainer from './components/empContainer';
import DrinksContainer from './components/drinksContainer';
import HeaderComp from './components/headerComp';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      drinksVisible: false,
      pickedAddress: '',
      uniqueValue: 0,
      loading: true,
      apiCall: false,
    };
  }

  async componentWillMount() {
    await initWeb3()
      .catch(err => console.log('initWeb3', err));

    await checkNewDeployment()
      .catch(err => console.log('checkNewDeployment', err));

    this.setState({ loading: false });
  }

  submit = async (drinksProp) => {
    const { pickedAddress } = this.state;
    const { mate, coffee, water } = drinksProp;

    try {
      mate && this.drinkMate(pickedAddress);
      coffee && this.drinkCoffee(pickedAddress);
      water && this.drinkWater(pickedAddress);

      await initWeb3();

      this.setState({ isVisible: true, apiCall: true });
      this.setState({ loading: false, apiCall: false });
      this.tmout = setTimeout(this.reloadInterface, 4000);
    } catch (error) {
      console.log('error on submit ', error);
    }
  };

  reloadInterface = async () => {
    console.log('reloadInterface');
    this.forceRemount();
    this.setState({ drinksVisible: false, isVisible: false });
    if (this.state.apiCall) {
      this.setState({ loading: true });
    }
  };

  next = (pickedAddress) => {
    this.setState({ drinksVisible: true, pickedAddress });
  };

  drinkCoffee = async (address) => {
    await payCoffee(address);
    await setDrinkData('coffee', address);
  };

  drinkWater = async (address) => {
    await payWater(address);
    await setDrinkData('water', address);
  };

  drinkMate = async (address) => {
    await payMate(address);
    await setDrinkData('mate', address);
  };

  forceRemount = () => {
    this.setState(({ uniqueValue }) => ({
      uniqueValue: uniqueValue > 0 ? 1 : 0,
    }));
    clearTimeout(this.tmout);
  };

  goBack = () => {
    this.setState({ drinksVisible: false });
  };

  render() {
    const {
      uniqueValue, drinksVisible, isVisible, loading,
    } = this.state;
    const pages = drinksVisible ? (
      <DrinksContainer ref={this.DrinksContainer} onSubmit={this.submit} />
    ) : (
      <EmpContainer ref={this.EmpContainer} onSubmit={this.next} />
    );

    const activity = (
      <View style={{ flex: 3, justifyContent: 'center' }}>
        <ActivityIndicator size={40} color="#0000ff" />
      </View>
    );

    return (
      <View style={styles.container} key={uniqueValue}>
        <HeaderComp visible={drinksVisible} goBack={this.goBack} />

        {!loading ? pages : activity}

        <Overlay
          isVisible={isVisible}
          onBackdropPress={this.reloadInterface}
          width={450}
          height={200}
        >
          <Text style={styles.text}>
            Cheers!
            {'\n'}
✅
          </Text>
        </Overlay>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
  },
  cards: {
    marginTop: 10,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'row',
    marginBottom: 0,
  },
  text: {
    fontSize: 70,
    textAlign: 'center',
  },
  overlay: {
    width: 150,
    height: 150,
    fontSize: 100,
  },
  button: {
    fontSize: 20,
  },
});
