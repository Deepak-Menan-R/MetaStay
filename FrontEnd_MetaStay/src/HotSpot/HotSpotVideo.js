//hotspotvideo.js
import React from 'react';
import { View, Video, asset, VrButton, MediaPlayerState } from 'react-360';

export default class HotSpotVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false
    };
    this.playerState = new MediaPlayerState({ autoPlay: false, muted: false });
    this.togglePlayPause = this.togglePlayPause.bind(this);
  }

  togglePlayPause() {
    this.setState(prevState => ({
      isPlaying: !prevState.isPlaying
    }), () => {
      this.state.isPlaying ? this.playerState.play() : this.playerState.pause();
    });
  }

  render() {
    return (
      <View style={{ 
        top: this.props.top, 
        left: this.props.left, 
        position: 'absolute',
        width: this.props.width,
        height: this.props.height,
        transform: [
          { perspective: 700 }, // Increase perspective for stronger 3D effect
          { rotateY: this.props.rotateY } // Rotate around Y-axis with negative angle
        ]
      }}>
        <VrButton onClick={this.togglePlayPause}>
          <Video
            style={{ width: '100%', height: '100%' }}
            source={asset(this.props.src)}
            playerState={this.playerState}
          />
        </VrButton>
      </View>
    );
  }
}

