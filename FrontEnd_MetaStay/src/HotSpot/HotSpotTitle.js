//hotspottitle.js

import React from 'react';
import { StyleSheet, Text, View, Image, asset, Animated, VrButton } from 'react-360';

const styles = StyleSheet.create({
  box: {
    width: 300,
    height: 200,
    opacity: 0.8,
    backgroundColor: 'black',
    borderColor: 'rgb(255, 255, 255)',
    borderWidth: 5,
    borderRadius: 20,
  },
  text: {
    fontSize: 17,
    textAlign: 'center',
    color: 'white',
    top: 10
  },
  infoPanel: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 200, 50, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17,
    width: 150,
    height: 50,
    backgroundColor: '#5dbea3',
    left: 75,
    top: 25
  },
});

export default class HotSpotTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  get locationStyle() {
    return {
      left: this.props.left,
      top: this.props.top,
      position: 'absolute',
    };
  }
    render() {
      return (
        <View style={[styles.box, this.locationStyle]}>
          <Text style={styles.text}>{`${this.props.text}`}</Text>
          {this.props.text !== "" && (
            <VrButton style={styles.button} onClick={this.props.toggleModal}>
              <Text>Room Expense Estimator</Text>
            </VrButton>
          )}
          {this.props.text === "" && (
            <View>
              <VrButton onClick={this.props.toggleProps} ><Image style={{height:150, width: 140, left: 90 , bottom:170}} source={asset('our_logo.jpeg')}></Image></VrButton>
              <Image style={{height:40, width: 150, left: 60 , bottom:150}} source={asset('concurLogo.png')}></Image>
            </View>
          )}
        </View>
      );
    } 
  }

