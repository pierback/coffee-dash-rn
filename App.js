/* eslint-disable no-underscore-dangle */
/* eslint-disable import/named */
/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';
import { StyleSheet, View, NetInfo, Text } from 'react-native';
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
    this._mounted = false;
  }

  async componentWillMount() {
    const isConnected = await NetInfo.isConnected.fetch();
    if (isConnected) {
      await this.initBchain();
      await execCachedTransactions();
      this._mounted = true;
    }
    this.setState({ isConnected, loading: !isConnected });
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  handleConnectivityChange = async (isConnected) => {
    console.log('HANDLECONNECTIVITYCHANGE: ', isConnected);

    if (isConnected && this._mounted) {
      await this.initBchain();
      // await execCachedTransactions();
    }
    !this.state.drinksVisible && this.setState({ isConnected, loading: !isConnected });
  };

  initBchain = async () => {
    try {
      await initWeb3()
        .catch(err => console.log('INITWEB3', err));

      await checkNewDeployment()
        .catch(err => console.log('CHECKNEWDEPLOYMENT', err));
    } catch (error) {
      console.log('initBchain: ', error);
    }
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
    const isConnected = await NetInfo.isConnected.fetch();
    this.setState({ drinksVisible: false, isVisible: false, isConnected, loading: !isConnected });
    this.forceRemount();

    /*  if (this.state.isConnected) {
      await execCachedTransactions();
    } */
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

    const showLoader = loading && !drinksVisible;

    return (
      <View style={styles.container} key={uniqueValue}>
        <HeaderComp visible={drinksVisible} goBack={this.goBack} />

        {!isConnected && !drinksVisible ? <OfflineText /> : null}
        {showLoader ? <ActivityComp /> : this.currentPage()}

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
