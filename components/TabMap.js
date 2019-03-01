// @ts-check
import * as React from 'react';
import {
  StyleSheet, Dimensions,
} from 'react-native';
import {
  TabView, TabBar, SceneMap, PagerPan,
} from 'react-native-tab-view';

import Icon from 'react-native-vector-icons/FontAwesome';
import Map from './Map';
import OverallConsumption from './OverallConsumption';
import UserConsumption from './UserConsumption';

export default class TabMap extends React.Component {
  state = {
    index: 1,
    routes: [
      { key: 'third', icon: 'bar-chart' },
      { key: 'first', icon: 'coffee' },
      { key: 'second', icon: 'user' },
    ],
  };

  _renderPager = props => <PagerPan {...props} />;

  _renderIcon = ({ route }) => (
    <Icon name={route.icon} size={24} style={styles.icon} />
  );

  renderTabBar = props => (
    <TabBar
      {...props}
      renderIcon={this._renderIcon}
      indicatorStyle={{ backgroundColor: 'black' }}
      style={{ backgroundColor: 'white' }}
    />
  );

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={SceneMap({
          third: OverallConsumption,
          first: Map,
          second: UserConsumption,
        })}
        tabBarPosition="bottom"
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
        swipeEnabled={false}
        renderTabBar={this.renderTabBar}
      />

    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  icon: {
    color: 'black',
  },
});
