import React from 'react'
import { View, Text } from 'react-native'
// import { randomHex } from 'web3-utils'

class OverallConsumption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: '',
      overallConsumption: {},
    }
  }

  componentDidMount() {
    const { nav } = this.props
    
  }

  render() {
    const { nav } = this.props
    nav.onNavigateLeftStartedListener(async ({ completed, isBack }) => {
      if (!isBack) {
        let tmp = await global.userData.task('fabp_92@hotmail.de');
        this.setState({ overallConsumption: tmp.overallConsumption });
      }
    });
    
    const listoverallConsumption = Object.values(this.state.overallConsumption).map((val, index) => {
      return <Text key={index}/* {randomHex(5)} */>{Object.keys(val)}: {Object.values(val)}</Text>;
    })
    console.log('listoverallConsumption: ', this.state.overallConsumption);

    return (
      <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 35, marginBottom: 20 }}>Overall Consumption</Text>
        {listoverallConsumption}
      </View>
    );
  }
}

export default OverallConsumption
