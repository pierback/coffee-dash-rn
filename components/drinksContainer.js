import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import Drinks from './drinks';

class DrinksContainer extends Component {
  constructor(props) {
    super(props);
    this.Drinks = React.createRef();
    this.state = {
      buttonDisabled: true,
    };
  }

  drink = () => {
    const { mate, coffee, water } = this.Drinks.current.state.selections;
    this.props.onSubmit({ mate, coffee, water });
  }

  drinkPicked = (selected) => {
    this.setState({ buttonDisabled: !selected });
  }

  render() {
    const { buttonDisabled } = this.state;
    return (
      <View style={styles.container}>
        <Drinks ref={this.Drinks} onSelection={this.drinkPicked} />
        <View
          style={{
            marginTop: 0,
            marginBottom: 100,
            width: 200,
            height: 20,
          }}
        >
          <Button
            title="SUBMIT"
            onPress={this.drink}
            titleStyle={styles.button}
            disabled={buttonDisabled}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    fontSize: 20,
  },
});

export default DrinksContainer;
