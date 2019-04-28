import React, { Component } from 'react';
import { View, TouchableHighlight, Image } from 'react-native';
import { Card } from 'react-native-elements';

class CardItem extends Component {
  toggle = () => {
    this.props.onToggle(this.props.id);
  };

  getTransItemStyle = style => ({
    width: style.width + 15,
    height: style.height,
    margin: 30,
    marginBottom: 15,
    marginTop: 25,
    opacity: 0.5,
    paddingBottom: 10,
  });

  getOpcaItemStyle = style => ({
    width: style.width + 15,
    height: style.height,
    margin: 30,
    marginBottom: 15,
    marginTop: 25,
    opacity: 1.0,
    paddingBottom: 10,
  });

  render() {
    const {
      imgPath, title, selected, style,
    } = this.props;

    const transItemStyle = this.getTransItemStyle(style);
    const opacItemStyle = this.getOpcaItemStyle(style);

    return (
      <View style={selected ? transItemStyle : opacItemStyle}>
        <TouchableHighlight onPress={this.toggle} underlayColor="transparent">
          <Card
            title={title}
            containerStyle={{
              width: style.width + 5,
              height: style.height - 45,
            }}
          >
            <View
              style={{
                width: style.width - 15,
                height: style.height - 85,
              }}
            >
              <Image
                style={{
                  width: style.width - 25,
                  height: style.height - 95,
                }}
                resizeMode="cover"
                source={imgPath}
              />
            </View>
          </Card>
        </TouchableHighlight>
      </View>
    );
  }
}

export default CardItem;
