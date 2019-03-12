/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import CardItem from './card2';

const personPic = require('../images/person.jpg');

const names = [
  'Wenzel',
  'Markus',
  'Michael',
  'Jörg',
  'Toni',
  'Karen',
  'Dominik',
  'David',
];

class Employes extends Component {
  constructor(props) {
    super(props);
    this.loadEmployes = this.loadEmployes.bind(this);
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

  loadEmployes() {
    return React.Children.toArray(
      names.map((item) => {
        console.log('item: ', item);
        return (
          <CardItem
            id={item}
            selected={this.state.selections[item]}
            onToggle={this.onChildToggle}
            imgPath={personPic}
            title={item}
          />
        );
      }),
    );
  }

  render() {
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <View style={styles.cards}>{this.loadEmployes()}</View>
    );
  }
}

const styles = StyleSheet.create({
  cards: {
    marginTop: 10,
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: '#F5FCFF',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 0,
  },
});

export default Employes;
