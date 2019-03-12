/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { StyleSheet, Picker, View } from 'react-native';

const nameAddressMap = [
  ['Thorben', '0x5409ed021d9299bf6814279a6a1411a7e866a631'],
  ['Manni', '0x6ecbe1db9ef729cbe972c83fb886247691fb6beb'],,
  ['Verena', '0xe36ea790bc9d7ab70c55260c66d52b1eca985f84'],
  ['Wolfgang', '0xe834ec434daba538cd1b9fe1582052b880bd7e63'],
  ['Maria', '0x78dc5d2d739606d31509c31d654056a45185ecb6'],
  ['Stefanie', '0xa8dda8d7f5310e4a9e24f8eba77e091ac264f872'],
];

class NamePicker extends Component {
  constructor(props) {
    super(props);
    // Use this.setState({userTypes: data}) when data comes from
    // firebase.
    this.loadUser = this.loadUser.bind(this);
    this.state = {
      val: nameAddressMap[0][1],
    };
  }

  loadUser() {
    return React.Children.toArray(
      nameAddressMap.map((item, index) => (
        <Picker.Item key={index} label={item[0]} value={item[1]} />
      )),
    );
  }

  render() {
    console.log('render:picker ');
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <View>
        <Picker
          style={styles.picker}
          selectedValue={this.state.val}
          onValueChange={(val) => {
            this.setState({ val });
          }}
        >
          {this.loadUser()}
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  picker: {
    height: 50,
    width: 400,
    marginTop: 70,
    marginBottom: 0,
  },
});

export default NamePicker;
