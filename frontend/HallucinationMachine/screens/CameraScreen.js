import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Button, Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { FileSystem } from 'expo';
import * as ImagePicker from 'expo-image-picker'
import { withNavigationFocus } from "react-navigation";

export default class CameraScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    hasCameraRollPermission: null,
    type: Camera.Constants.Type.back,
    imgSource: null
  };

  async componentDidMount() {
    console.log('componentDidMount');
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { hasCameraPermission } = this.state;
    const { imgSource } = this.state
    const isFocused = this.props.navigation.isFocused();
    console.log("Camera tab is focused: " + isFocused)
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else if (imgSource !== null) { // if the image is picked from the gallery or captured with the camera
      return (
        <View style={{ flex: 1 }}>
          <Image style={styles.capturedImage} source={imgSource}/>
          <View style={styles.buttonBar}>
            <View>
              <Ionicons 
                name='md-arrow-back' 
                size={30} 
                onPress = {() => {
                  this.setState({
                    imgSource: null
                  })
                }}
              />
            </View>
            <View>
              <Button title='Dream' color='black'/>
            </View>
          </View>
        </View>
      )
    } else if (!isFocused) { // TODO: fix, camera has to run when the tab is switched
      return (
        <View>
          <Text>Camera tab is not in focus</Text>
        </View>
      )
    } else if (isFocused) { // otherwise, render the camera
      return (
        <View style={{ flex: 1 }}>
          <Camera 
            style={{ flex: 1 }} 
            type={this.state.type}
            ref={ref => { this.camera = ref; }}>
          </Camera>
          <View style={styles.buttonBar}>
            <View>
            <Ionicons name='md-images' size={30} onPress={this.handlePickImage}/>
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

  handlePickImage = async () => {
    // TODO: this is never checked
    if (this.state.hasCameraPermission === null) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({ hasCameraRollPermission: status === 'granted' });
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false
    });

    console.log('picked from camera roll: ' + result.uri);

    if (!result.cancelled) {
      this.setState({ 
        imgSource: { 
          uri: result.uri 
        }
      });
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