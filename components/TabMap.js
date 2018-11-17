import * as React from 'react';
import {
  View, StyleSheet, Dimensions, Text,
} from 'react-native';
import {
  TabView, TabBar, SceneMap, PagerPan,
} from 'react-native-tab-view';
import Map from './Map';
import OverallConsumption from './OverallConsumption';
import UserConsumption from './UserConsumption';

const FirstRoute = () => (
  <Map />
);
const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: 'white' }]}>
    <Text>asdf</Text>
  </View>
);

export default class TabMap extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'First' },
      { key: 'second', title: 'Second' },
    ],
  };

  _renderPager = props => <PagerPan {...props} />;

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={SceneMap({
          first: FirstRoute,
          second: SecondRoute,
        })}
        tabBarPosition="bottom"
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
        swipeEnabled={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});
