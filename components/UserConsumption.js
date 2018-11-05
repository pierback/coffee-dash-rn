import React from 'react'
import { View, Text } from 'react-native'
// import { randomHex } from 'web3-utils'

class UserConsumption extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: '',
            userConsumption: {},
        }
    }

    componentDidMount() {
        const { nav } = this.props
        nav.onNavigateRightStartedListener(async ({ completed, isBack }) => {
            if (!isBack) {
                let tmp = await global.userData.task('fabp_92@hotmail.de');
                this.setState({ userConsumption: tmp.userConsumption });
            }
        });
    }

    render() {
        const listuserConsumption = Object.values(this.state.userConsumption).map((val, index) => {
            return <Text key={index}/* {randomHex(5)} */>{Object.keys(val)}: {Object.values(val)}</Text>;
        })
        console.log('userConsumption: ', this.state.userConsumption);

        return (
            <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 35, marginBottom: 20 }}>User Consumption</Text>
                {listuserConsumption}
            </View>
        );
    }
}

export default UserConsumption
