/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import CardItem from './card2';

const matePic = require('../images/cmate.jpeg');
const waterPic = require('../images/water.jpg');
const coffeePic = require('../images/justcoffee.jpg');

const drinkArr = [
  ['mate', 'Club Mate', matePic],
  ['water', 'Water', waterPic],
  ['coffee', 'Coffee', coffeePic],
];

class Drinks extends Component {
  constructor(props) {
    super(props);
    this.loadDrinks = this.loadDrinks.bind(this);
    this.onChildToggle = this.onChildToggle.bind(this);
    this.state = {
      selections: {
        mate: false,
        coffee: false,
        water: false,
      },
    };
  }

  onChildToggle(id, selected) {
    console.log('onChildToggle: ', id, selected);
    const { selections } = this.state;

    const sel = Object.entries(selections).reduce((acc, [key, val]) => {
      // if id equals key --> true && toggle val to unselect card
      acc[key] = id === key && !val;
      console.log('reduce', key, val, id === key, !val);
      return acc;
    }, {});

    this.setState({ selections: sel });
  }

  loadDrinks() {
    return React.Children.toArray(
      drinkArr.map((item) => {
        console.log('item: ', item);
        return (
          <CardItem
            id={item[0]}
            selected={this.state.selections[item[0]]}
            onToggle={this.onChildToggle}
            imgPath={item[2]}
            title={item[1]}
          />
        );
      }),
    );
  }

  render() {
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <View style={styles.cards}>{this.loadDrinks()}</View>
    );
  }
}

const styles = StyleSheet.create({
  cards: {
    marginTop: 10,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'row',
    marginBottom: 0,
  },
});

export default Drinks;
