import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import Employes from './employes';

const nameAddressMap = [
  ['wenzel', '0x5409ed021d9299bf6814279a6a1411a7e866a631'],
  ['markus', '0x6ecbe1db9ef729cbe972c83fb886247691fb6beb'],
  ['michael', '0xe36ea790bc9d7ab70c55260c66d52b1eca985f84'],
  ['jörg', '0xe834ec434daba538cd1b9fe1582052b880bd7e63'],
  ['toni', '0x78dc5d2d739606d31509c31d654056a45185ecb6'],
  ['karen', '0x06cef8e666768cc40cc78cf93d9611019ddcb628'],
  ['dominik', '0x4404ac8bd8f9618d27ad2f1485aa1b2cfd82482d'],
  ['david', '0x7457d5e02197480db681d3fdf256c7aca21bdc12'],
];

class EmpContainer extends Component {
  constructor(props) {
    super(props);
    this.Employes = React.createRef();
    this.state = { buttonDisabled: true };
  }

  next = () => {
    const { selected } = this.Employes.current.state;
    const address = nameAddressMap.filter(
      person => person[0] === selected,
    )[0][1];
    console.log('address: ', address);
    this.props.onSubmit(address);
  };

  personPicked = (selected) => {
    this.setState({ buttonDisabled: !selected });
  };

  render() {
    const { buttonDisabled } = this.state;
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <View style={styles.container}>
        <Employes
          ref={this.Employes}
          onSelection={this.personPicked}
          names={nameAddressMap.reduce((acc, pers) => {
            acc[pers[0]] = false;
            return acc;
          }, {})}
        />
        <View
          style={{
            marginTop: 0,
            marginBottom: 100,
            width: 200,
            height: 20,
          }}
        >
          <Button
            title="NEXT"
            onPress={this.next}
            titleStyle={styles.button}
            disabled={buttonDisabled}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    fontSize: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
  },
});

export default EmpContainer;
