import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import { LoginContainer } from 'AppContainers';
import { connectFeathers } from 'AppConnectors';
import { BG_DARK_GRAY } from 'AppColors';
import Keyboard from 'Keyboard';
import { WINDOW_HEIGHT } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: WINDOW_HEIGHT,
    backgroundColor: BG_DARK_GRAY,
  },
});

class _LoginScene extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      isMounted: false,
      keyboardHeight: new Animated.Value(0),
      keyboardShown: false,
    };
    this.routeScene = this.routeScene.bind(this);
    this.routeLoginSuccess = ::this.routeLoginSuccess;
    this.logout = ::this.logout;
    this.signupSocialUser = ::this.signupSocialUser;
    this.onKeyboardUpdated = ::this.onKeyboardUpdated;
  }

  componentWillMount() {
    this.props.feathers.authenticate()
    .then((user) => this.routeLoginSuccess(user))
    .catch((e) => this.logout(e));
    this.subscriptions = [];
    if (Platform.OS === 'ios') {
      this.subscriptions = [
        Keyboard.addListener('keyboardWillHide', (event) => this.onKeyboardUpdated(event, false)),
        Keyboard.addListener('keyboardWillShow', (event) => this.onKeyboardUpdated(event, true)),
      ];
    } else {
      this.subscriptions = [
        Keyboard.addListener('keyboardDidHide', (event) => this.onKeyboardUpdated(event, false)),
        Keyboard.addListener('keyboardDidShow', (event) => this.onKeyboardUpdated(event, true)),
      ];
    }
  }

  componentWillUnmount() {
    this.subscriptions.forEach((sub) => sub.remove());
  }

  onKeyboardUpdated(event, type) {
    console.info('event', type);
    const toValue = !type ? 0 : event.endCoordinates.height * -1;
    console.info('toValue', toValue);
    Animated.timing(
      this.state.keyboardHeight, {
        toValue,
        duration: 150,
      }
    ).start();
    this.setState({ keyboardShown: type });
  }

  routeLoginSuccess(user) {
    const { navigator } = this.props;
    if (user.data.isClient !== undefined) {
      if (user.data.isClient) {
        navigator.resetTo('ClientScene');
      } else {
        navigator.resetTo('TrainerScene');
      }
    } else {
      this.props.navigator.push({ name: 'SignupScene', passProps: { socialUser: user } });
    }
  }

  logout() {
    this.props.feathers.logout();
    this.setState({ isMounted: true });
  }

  routeScene(scene) {
    this.props.navigator.push(scene);
  }

  signupSocialUser(socialUser) {
    console.info('Social User~~~~~~~', socialUser);
    if (socialUser._id === '') {
      this.props.navigator.push({ name: 'SignupScene' });
    } else {
      this.props.navigator.push({ name: 'SignupScene', passProps: { socialUser } });
    }
    return null;
  }

  render() {
    const { feathers } = this.props;
    // const { isMounted } = this.state;
    const { keyboardHeight } = this.state;
    return (
      <Animated.View
        style={[styles.container, { top: keyboardHeight }]}
      >
        <LoginContainer
          feathers={feathers}
          routeSignup={() => this.routeScene('SignupScene')}
          routeLoginSuccess={this.routeLoginSuccess}
          signupSocialUser={this.signupSocialUser}
        />
      </Animated.View>
    );
  }
}

export const LoginScene = connectFeathers(_LoginScene, true);
