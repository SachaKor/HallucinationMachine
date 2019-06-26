// import React from 'react';
// import {View, Text} from 'react-native';

// export default function CameraScreen() {
//   return (
//     <View>
//       <Text>
//         This is the camera screen, see './screens/CameraScreen.js'
//       </Text>
//     </View>
//   )
// }

import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Button, Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import shorthash from 'shorthash';
import { FileSystem } from 'expo';

export default class CameraScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    imgSource: null
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { hasCameraPermission } = this.state;
    const { imgSource } = this.state
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else if (imgSource !== null) {
      let pic = {
        uri: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Cucumber_BNC.jpg'
      };
      return (
        <Image 
          style={styles.capturedImage} 
          source={imgSource}
          />
      )
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera 
            style={{ flex: 1 }} 
            type={this.state.type}
            ref={ref => { this.camera = ref; }}>
          </Camera>
          <View style={styles.buttonBar}>
            <View>
            <Ionicons name='md-images' size={30}/>
            </View>
            <View>
              <Ionicons 
                name='md-camera' 
                size={30}
                onPress={async () => {
                  if (this.camera) {
                    try {
                      let photo = await this.camera.takePictureAsync();
                      console.log(photo);
                      await this.setState({
                        imgSource: {
                          uri: photo.uri
                        }
                      })
                    } catch(e) {
                      console.log(e)
                    }
                  }
                }}
                />
            </View>
            <View>
              <Ionicons 
                name='md-reverse-camera' 
                size={30} 
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                  });
                }}
              />
            </View>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  buttonBar: {
    flex: 0.15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20
  },
  button: {
    width: 50,
    height: 50,
    backgroundColor: '#aaa'
  },
  capturedImage: {
    flex: 1,
    backgroundColor: '#555'
  }
});