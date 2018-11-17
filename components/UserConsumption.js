import React from 'react'
import { View, Text } from 'react-native'
// import { randomHex } from 'web3-utils'
import {PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';

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

    _renderTitleIndicator() {
        return <PagerTitleIndicator titles={['one', 'two', 'three']} />;
    }

    _renderDotIndicator() {
        return <PagerDotIndicator pageCount={3} />;
    }
    
    render() {
        const listuserConsumption = Object.values(this.state.userConsumption).map((val, index) => {
            return <Text key={index}/* {randomHex(5)} */>{Object.keys(val)}: {Object.values(val)}</Text>;
        })
        console.log('userConsumption: ', this.state.userConsumption);

        return (
            
            <View style={{flex:1}}>
                <IndicatorViewPager
                    style={{height:200}}
                    indicator={this._renderDotIndicator()}
                >
                    <View style={{backgroundColor:'cadetblue'}}>
                        <Text>page one</Text>
                    </View>
                    <View style={{backgroundColor:'cornflowerblue'}}>
                        <Text>page two</Text>
                    </View>
                    <View style={{backgroundColor:'#1AA094'}}>
                        <Text>page three</Text>
                    </View>
                </IndicatorViewPager>
            </View>
        );
    }
}

export default UserConsumption
