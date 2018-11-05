import React from 'react'
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native'

const { width, height } = Dimensions.get('window');


/* login = new Login(web3, userController, app);
register = new Register(web3, userController);
insert = new InserCoffee(web3, userController); */

class Map extends React.Component {
  state = {
    loading: false
  };

  constructor() {
    super()
    this.insertCoffee = this.insertCoffee.bind(this)
  }

  componentDidMount() {
    this.setState({ loading: false })
  }

  async insertCoffee() {
    this.setState({ loading: true })
    global.insertCoffee.task('fabp_92@hotmail.de')
      .then(() => {
        this.setState({ loading: false })
        this.props.nav.navigateRight()
      })
      .catch(() => {
        this.setState({ loading: false })
        this.props.nav.navigateRight()
      })

  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#499324', alignItems: 'center', justifyContent: 'center', borderColor: 'gray', borderWidth: 1 }}>
        <Text style={{ fontSize: 35 }}>Map</Text>
        {this.state.loading &&
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#0000ff" />
            <View style={styles.overlay} />
          </View>
        }

        <TouchableOpacity onPress={this.insertCoffee} style={styles.button}>
          <Button title="Drink Coffee" style={styles.button}> </Button>
        </TouchableOpacity>

        {/* <Button
          style={styles.button}
          onPress={this.insertCoffee}
          title="Drink Coffee"
          color="black"
          accessibilityLabel="Learn more about this purple button"
        /> */}


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
    justifyContent: 'center'
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    width: width,
    height: height
  },
  button: {
    marginTop: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    overflow: 'hidden',
    color: "black",  
    borderColor: "black", 
  }
});


export default Map
