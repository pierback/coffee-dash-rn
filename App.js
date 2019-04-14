/* eslint-disable import/named */
/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';
import { StyleSheet, View, NetInfo } from 'react-native';
import { checkNewDeployment, initWeb3, Drink } from './bchain/web3Init';
import { execCachedTransactions } from './bchain/bvrglst';
import EmpContainer from './components/empContainer';
import DrinksContainer from './components/drinksContainer';
import HeaderComp from './components/headerComp';
import ActivityComp from './components/activityItem';
import OfflineText from './components/offlineText';
import OverlayItem from './components/overlayItem';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      drinksVisible: false,
      pickedAddress: '',
      uniqueValue: 0,
      loading: true,
      isConnected: true,
    };
  }

  async componentWillMount() {
    await this.initBchain();
    const isConnected = await NetInfo.isConnected.fetch();
    console.log('COMPONENTWILLMOUNT ISCONNECTED: ', isConnected);

    isConnected && await execCachedTransactions();
    this.setState({ isConnected, loading: !isConnected });
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = async (isConnected) => {
    console.log('HANDLECONNECTIVITYCHANGE: ', isConnected);

    if (isConnected) {
      await this.initBchain();
      await execCachedTransactions();
    }
    this.setState({ isConnected, loading: !isConnected });
  };

  initBchain = async () => {
    await initWeb3()
      .catch(err => console.log('INITWEB3', err));

    await checkNewDeployment()
      .catch(err => console.log('CHECKNEWDEPLOYMENT', err));
  }

  submit = async (drinksProp) => {
    const { pickedAddress } = this.state;
    const { mate, coffee, water } = drinksProp;

    try {
      this.setState({ isVisible: true });
      this.tmout = setTimeout(this.reloadInterface, 4000);

      mate && Drink('mate', pickedAddress);
      coffee && Drink('coffee', pickedAddress);
      water && Drink('water', pickedAddress);

      await initWeb3();

      this.setState({ loading: false });
    } catch (error) {
      console.log('ERROR ON SUBMIT', error);
    }
  };

  reloadInterface = async () => {
    console.log('RELOADINTERFACE');
    this.setState({ drinksVisible: false, isVisible: false });
    this.forceRemount();

    if (!this.state.isConnected) {
      this.setState({ loading: true });
    } else {
      await execCachedTransactions();
    }
  };

  next = (pickedAddress) => {
    this.setState({ drinksVisible: true, pickedAddress });
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

  currentPage = () => (this.state.drinksVisible ? (
    <DrinksContainer ref={this.DrinksContainer} onSubmit={this.submit} />
  ) : (
    <EmpContainer ref={this.EmpContainer} onSubmit={this.next} />
  ))

  render() {
    const {
      uniqueValue, drinksVisible, isVisible, loading, isConnected,
    } = this.state;

    return (
      <View style={styles.container} key={uniqueValue}>
        <HeaderComp visible={drinksVisible} goBack={this.goBack} />

        {!isConnected ? <OfflineText /> : null}
        {!loading ? this.currentPage() : <ActivityComp />}

        <OverlayItem isVisible={isVisible} reloadInterface={this.reloadInterface} />
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
