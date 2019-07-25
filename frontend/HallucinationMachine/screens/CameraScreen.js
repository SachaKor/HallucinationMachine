import React from 'react';
import { 
  Text, 
  View, 
  StyleSheet,
  Button, 
  Image, 
  Alert,
  CameraRoll,
  ToastAndroid,
  Share } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { SERVER_URL } from 'react-native-dotenv';
import { connect } from 'react-redux';

class CameraScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    hasCameraRollPermission: null,
    type: Camera.Constants.Type.back,
    image: null,
    processedImage: null,
    resultSaved: false
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });

    FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory + 'images')
      .catch(e => {
        console.log(e, 'Directory exists');
      });
  }

  render() {
    const { 
      hasCameraPermission, 
      image, 
      imageWidth, 
      imageHeight,
      processedImage } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else if (processedImage) { 
      return (
        <View style={styles.imageView}>
          <Image style={styles.capturedImage} source={{uri: processedImage.uri}}/>
          <View style={styles.buttonBar}>
            <View>
              <Ionicons 
                name='md-arrow-back' 
                size={30} 
                onPress = {this.displayUnsavedImageAlert}
              />
            </View>
              <Button title='Save' color='black' onPress={this.handleSaveButtonPress}/>
            </View>
          </View>
      )
    } else if (image) { // if the image is picked from the gallery or captured with the camera
      return (
        <View style={{ flex: 1 }}>
          <Image style={styles.capturedImage} source={{uri: image.uri}}/>
          <View style={styles.buttonBar}>
            <View>
              <Ionicons 
                name='md-arrow-back' 
                size={30} 
                onPress = {this.handleBackArrowPressed}
              />
            </View>
            <View>
              <Button title='Dream' color='black' onPress = {this.handleDreamButtonPress}/>
            </View>
          </View>
        </View>
      )
    } else { // otherwise, render the camera  
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

  handleBackArrowPressed = () => {
    this.setState({
      image: null,
      processedImage: null,
      resultSaved: false
    })
  }

  // mayybe display
  displayUnsavedImageAlert = () => {
    const {resultSaved} = this.state;
    if(!resultSaved) {
      Alert.alert(
        'Save the image',
        'The image will be lost if you leave this page\nWould you like to save the image?',
        [
          {
            text: 'YES',
            onPress: this.handleSaveButtonPress,
            style: 'cancel',
          },
          {
            text: 'NO', 
            onPress: this.handleBackArrowPressed
          },
        ],
        {cancelable: false},
      );
    } else {
      this.handleBackArrowPressed()
    }
  }

  handleSaveButtonPress = () => {
    const {processedImage, resultSaved} = this.state
    if(processedImage && !resultSaved) {
      const path = FileSystem.cacheDirectory + 'images/processed.jpg'
      var image_data = processedImage.uri.split('data:application/octet-stream;base64,')
      image_data = image_data[1]
      FileSystem.writeAsStringAsync(
        path, 
        image_data, 
        {encoding: FileSystem.EncodingType.Base64})
        .then(res => {
          CameraRoll.saveToCameraRoll(path)
          ToastAndroid.show('Saved', ToastAndroid.SHORT);
          FileSystem.deleteAsync(path)
          this.setState({resultSaved: true})
        })
    } else if(!processedImage) {
      alert('Nothing  to save!')
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
    if (this.camera) {
      this.camera.takePictureAsync({ quality: 0.1 })
        .then(img => this.setState({
          image: img
        }))
    }
  }

  handlePickImage = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.1
    })
      .then(result => {
        if(result.cancelled === false) {
          this.setState({
            image: result
          })
        }
      })
  }

  handleDreamButtonPress = () => {
    const {image} = this.state;
    console.log('SERVER URL: ' + SERVER_URL)
    const selectedLayers = this.props.layers.filter(layer => layer.selected)
    if (selectedLayers.length === 0) {
      alert('No layers selected. Please go to the Settings tab and select the layers to amplify')
      return
    } 
    if(image) {
      const uri = image.uri
      let formData = new FormData();
      let uriParts = uri.split('.');
      let fileType = uriParts[uriParts.length - 1];

      formData.append('file', {
        uri,
        name: `image.${fileType}`,
        type: `image/${fileType}`
      });

      formData.append('layer', JSON.stringify(selectedLayers[0]))

      let options = {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        }
      };

      fetch(SERVER_URL+'/dream', options)
        .then(res => {
          alert('Voilà!')
          res.blob()
            .then((blo) => {
              const fr = new FileReader();
              fr.readAsDataURL(blo)
              fr.onload = () => {
                const base64img = fr.result;
                this.setState({
                  processedImage: {
                    uri: base64img
                  }
                })
              }
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err));
    } else {
      alert('No image picked!')
    }
  }
}

const mapStateToProps = state => ({
  layers: state.Layers.layerData
});

export default connect(mapStateToProps)(CameraScreen);

const styles = StyleSheet.create({
  imageView: {
    flex: 1
  },
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