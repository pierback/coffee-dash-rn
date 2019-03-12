/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import { Card } from 'react-native-elements';

class CardItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
    };
  }

  toggle() {
    console.log('this.props: ', this.props);
    this.props.onToggle(this.props.id, !this.props.selected);
  }

  render() {
    const {
      imgPath, title, id, selected, onToggle,
    } = this.props;
    return (
      <View style={selected ? styles.transItem : styles.opacItem}>
        <TouchableHighlight
          onPress={() => {
            console.log('title: ', title);
            this.toggle();
            // this.setState({ selected: !isSelected });
          }}
          underlayColor="transparent"
        >
          <Card
            title={title}
            image={imgPath}
            containerStyle={{ width: 250, height: 320 }}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  opacItem: {
    margin: 65,
    width: 255,
    height: 275,
    opacity: 1.0,
  },
  transItem: {
    margin: 65,
    width: 255,
    height: 275,
    opacity: 0.5,
  },
});

export default CardItem;
