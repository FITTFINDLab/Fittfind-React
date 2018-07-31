import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { Trainer } from 'AppComponents';
import { connectFeathers } from 'AppConnectors';


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export class TrainerContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object,
    showSideBar: PropTypes.func,
    navigator: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }

  render() {
    const { feathers, showSideBar, navigator } = this.props;
    return (
      <View style={styles.container}>
        <Trainer
          feathers={feathers}
          showSideBar={showSideBar}
          navigator={navigator}
        />
      </View>
    );
  }
}
export default connectFeathers(TrainerContainer);
