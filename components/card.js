/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

import {
  CheckBox,
  Divider,
  Card,
  ListItem,
  Button,
  Icon,
  Overlay,
  Header,
} from 'react-native-elements';

const matePic = require('../images/cmate.jpeg');
const waterPic = require('../images/justwater.jpeg');
const coffeePic = require('../images/justcoffee.jpg');


const { width, height } = Dimensions.get('window');

class Map extends React.Component {
  state = {
    loading: false,
  };

  constructor() {
    super();
  }

  componentDidMount() {
    global.loading = false;
    this.setState({ loading: false });
  }

  render() {
    return (

      <View style={{
        height: '100%', flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderColor: 'gray', borderWidth: 1,
      }}
      >
        <Overlay
          isVisible={this.state.loading}
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          overlayBackgroundColor="gray"
          width="auto"
          height="auto"
        >
          <ActivityIndicator size="large" color="black" />
        </Overlay>
        <View style={{
          width: '100%', flex: 1, flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-around', paddingTop: 30,
        }}
        >
          <TouchableOpacity onPress={this.insertCoffee}>
            <Card
              title="Club Mate"
              image={matePic}
              containerStyle={{ width: 100, height: 220 }}
            >
              {/*
            <Button
              backgroundColor="#03A9F4"
              buttonStyle={{
                borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0,
              }}
              onPress={this.insertCoffee}
              title="DRINK"
            /> */}
            </Card>
          </TouchableOpacity>


          <TouchableOpacity onPress={this.insertCoffee}>
            <Card
              title="Water"
              image={waterPic}
              containerStyle={{ width: 100, height: 220 }}
            >
              {/* <Button
              backgroundColor="#03A9F4"
              buttonStyle={{
                borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0,
              }}
              onPress={this.insertCoffee}
              title="DRINK"
            /> */}
            </Card>
          </TouchableOpacity>
        </View>

        {/*  {this.state.loading &&
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#0000ff" />
            <View style={styles.overlay} />
          </View>
        } */}

        <TouchableOpacity onPress={this.insertCoffee} style={{ paddingBottom: 30 }}>
          <Card
            containerStyle={{ width: '70%', marginBottom: 20 }}
            title="Coffee"
            image={coffeePic}
            containerStyle={{ width: 300, height: 220 }}
          >
            {/* <Button
              backgroundColor="#03A9F4"
              buttonStyle={{
                borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0,
              }}
              onPress={this.insertCoffee}
              title="DRINK"
            /> */}
          </Card>
        </TouchableOpacity>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    width,
    height,
  },
  button: {
    marginTop: 30,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    color: 'black',
    borderColor: 'black',
  },
});


export default Map;
