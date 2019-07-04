import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Button, Image, Platform } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'
import { withNavigationFocus } from "react-navigation";
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { SERVER_URL } from 'react-native-dotenv'

export default class CameraScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    hasCameraRollPermission: null,
    type: Camera.Constants.Type.back,
    image: null
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { hasCameraPermission } = this.state;
    const { image } = this.state
    const isFocused = this.props.navigation.isFocused();
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else if (image) { // if the image is picked from the gallery or captured with the camera
      return (
        <View style={{ flex: 1 }}>
          <Image style={styles.capturedImage} source={{uri: image.uri}}/>
          <View style={styles.buttonBar}>
            <View>
              <Ionicons 
                name='md-arrow-back' 
                size={30} 
                onPress = {() => {
                  this.setState({
                    image: null
                  })
                }}
              />
            </View>
            <View>
              <Button title='Dream' color='black' onPress = {this.handleDreamButtonPress}/>
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
            <View><Ionicons name='md-images' size={30} onPress={this.handlePickImage}/></View>
            <View>
              <Ionicons 
                name='md-camera' 
                size={30}
                onPress={this.handleCaptureImage}/>
            </View>
            <View>
              <Ionicons 
                name='md-reverse-camera' 
                size={30} 
                onPress={this.handleFlipCamera}/>
            </View>
          </View>
        </View>
      );
    }
  }

  handleFlipCamera = () => {
    this.setState({
      type:
        this.state.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back,
    });
  }

  handleCaptureImage = () => {
    Permissions.askAsync(Permissions.CAMERA)
      .then(perm => {
        if (perm.status == 'granted') {
          this.setState({
            hasCameraPermission: true
          })
          ImagePicker.launchCameraAsync({
            allowsEditing: false
          })
            .then(res => {
              this.setState({
                image: res
              })
            })
        }
      })
  }

  handlePickImage = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false
    })
      .then(result => {
        console.log("img uri: " + result.uri)
        this.setState({
          image: result
        })
      })
  }

  handleDreamButtonPress = () => {
    const {image} = this.state;
    if(image) {
      const uri = image.uri
      let formData = new FormData();
      let uriParts = uri.split('.');
      let fileType = uriParts[uriParts.length - 1];
      const serverAddress = 'http://192.168.1.115:5000'
      console.log("SERVER_URL: ", SERVER_URL);

      console.log('fileType: ' + fileType);

      formData.append('file', {
        uri,
        name: `image.${fileType}`,
        type: `image/${fileType}`
      });

      let options = {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        }
      };

      fetch(SERVER_URL, options)
        .then(res => {
          alert('Image successfully uploaded!')
          res.json
        })
        .then(resJson => console.log(JSON.stringify(resJson)))
        .catch(err => console.log(err));
    } else {
      alert('No image picked!')
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