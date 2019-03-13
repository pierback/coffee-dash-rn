import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import CardItem from "./cardItem";

const personPic = require("../images/person.jpg");

class Employes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      names: {},
      selected: null
    };
    ({ names: this.state.names } = this.props);
  }

  onToggle = id => {
    const { names } = this.state;

    const newSelection = Object.entries(names).reduce((acc, [key, val]) => {
      const name = key.toLocaleLowerCase();
      // if id equals key --> true && toggle val to unselect card
      acc[name] = id === name && !val;
      return acc;
    }, {});

    this.props.onSelection(newSelection[id]);
    this.setState({ names: newSelection, selected: id });
  };

  nameCapitalized = name => name.charAt(0).toUpperCase() + name.slice(1);

  loadEmployes = () => {
    const { names } = this.state;

    return React.Children.toArray(
      Object.keys(names).map(item => (
        <CardItem
          id={item}
          selected={names[item]}
          onToggle={this.onToggle}
          imgPath={personPic}
          title={this.nameCapitalized(item)}
          style={{
            height: 220,
            width: 150
          }}
        />
      ))
    );
  };

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
    justifyContent: "space-around",
    backgroundColor: "#F5FCFF",
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 0
  }
});

export default Employes;
