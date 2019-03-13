import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import CardItem from './cardItem';

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
    this.state = {
      selections: {
        mate: false,
        coffee: false,
        water: false,
      },
    };
  }

  onToggle = (id) => {
    const { selections } = this.state;

    const newSelection = Object.entries(selections).reduce((acc, [key, val]) => {
      // if id equals key --> true && toggle val to unselect card
      acc[key] = id === key && !val;
      return acc;
    }, {});

    this.props.onSelection(newSelection[id]);

    this.setState({ selections: newSelection });
  }

  loadDrinks = () => {
    const { selections } = this.state;
    return React.Children.toArray(
      drinkArr.map(item => (
        <CardItem
          id={item[0]}
          selected={selections[item[0]]}
          onToggle={this.onToggle}
          imgPath={item[2]}
          title={item[1]}
          style={{
            height: 410,
            width: 290,
          }}
        />
      )),
    );
  }

  render() {
    return (
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
