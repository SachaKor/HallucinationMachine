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
  Share
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { SERVER_URL } from 'react-native-dotenv';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';

class CameraScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    hasCameraRollPermission: null,
    type: Camera.Constants.Type.back,
    image: null,
    processedImage: null,
    resultSaved: false,
    isFocused: true,
    dreamButtonDisabled: false,
    cameraImageSize: null
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });

    FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory + 'images').catch(e => {
      console.log(e, 'Directory exists');
    });
  }

  render() {
    const {
      hasCameraPermission,
      image,
      imageWidth,
      imageHeight,
      processedImage,
      dreamButtonDisabled
    } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else if (processedImage) {
      return (
        <View style={styles.imageView}>
          <Image style={styles.capturedImage} source={{ uri: processedImage.uri }} />
          <View style={styles.buttonBar}>
            <View>
              <Ionicons name="md-arrow-back" size={30} onPress={this.displayUnsavedImageAlert} />
            </View>
            <Button title="Save" color="black" onPress={this.handleSaveButtonPress} />
          </View>
        </View>
      );
    } else if (image) {
      // if the image is picked from the gallery or captured with the camera
      return (
        <View style={{ flex: 1 }}>
          <Image style={styles.capturedImage} source={{ uri: image.uri }} />
          <View style={styles.buttonBar}>
            <View>
              <Ionicons name="md-arrow-back" size={30} onPress={this.handleBackArrowPressed} />
            </View>
            <View>
              <Button
                title="Dream"
                color="black"
                disabled={dreamButtonDisabled}
                onPress={this.handleDreamButtonPress}
              />
            </View>
          </View>
        </View>
      );
    } else if (this.state.isFocused === false) {
      return (
        <NavigationEvents
          onWillFocus={payload => {
            //console.log("will focus", payload);
            this.setState({ isFocused: true });
          }}
          onDidBlur={payload => {
            //console.log('did leave',payload)
            this.setState({ isFocused: false });
          }}
        />
      );
    } else {
      // otherwise, render the camera
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={this.state.type}
            pictureSize={this.state.cameraImageSize}
            onCameraReady={this.setOptimalCameraSize.bind(this)}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <NavigationEvents
              onWillFocus={payload => {
                //console.log("will focus", payload);
                this.setState({ isFocused: true });
              }}
              onDidBlur={payload => {
                //console.log('did leave',payload)
                this.setState({ isFocused: false });
              }}
            />
          </Camera>
          <View style={styles.buttonBar}>
            <View>
              <Ionicons name="md-images" size={30} onPress={this.handlePickImage} />
            </View>
            <View>
              <Ionicons name="md-camera" size={30} onPress={this.handleCaptureImage} />
            </View>
            <View>
              <Ionicons name="md-reverse-camera" size={30} onPress={this.handleFlipCamera} />
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
    });
  };

  // maybe display
  displayUnsavedImageAlert = () => {
    const { resultSaved } = this.state;
    if (!resultSaved) {
      Alert.alert(
        'Save the image',
        'The image will be lost if you leave this page\nWould you like to save the image?',
        [
          {
            text: 'YES',
            onPress: this.handleSaveButtonPress,
            style: 'cancel'
          },
          {
            text: 'NO',
            onPress: this.handleBackArrowPressed
          }
        ],
        { cancelable: false }
      );
    } else {
      this.handleBackArrowPressed();
    }
  };

  handleSaveButtonPress = () => {
    const { processedImage, resultSaved } = this.state;
    if (processedImage && !resultSaved) {
      const path = FileSystem.cacheDirectory + 'images/processed.jpg';
      var image_data = processedImage.uri.split('data:application/octet-stream;base64,');
      image_data = image_data[1];
      FileSystem.writeAsStringAsync(path, image_data, { encoding: FileSystem.EncodingType.Base64 })
        .then(res => {
          CameraRoll.saveToCameraRoll(path).catch(err => console.log(err));
          ToastAndroid.show('Saved', ToastAndroid.SHORT);
          FileSystem.deleteAsync(path);
          this.setState({ resultSaved: true });
        })
        .catch(err => console.log(err));
    } else if (!processedImage) {
      alert('Nothing  to save!');
    }
  };

  handleFlipCamera = () => {
    this.setState({
      type:
        this.state.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    });
  };

  handleCaptureImage = async () => {
    if (this.camera) {
      const img = await this.camera.takePictureAsync();
      console.log('Taken picture of size: ' + img.width + 'x' + img.height);
      this.setState({
        image: img
      });
    }
  };

  chooseBetterSize(size1, size2) {
    // If a size is smaller than min size, choose bigger one.
    // If both sizes bigger than min size, choose smaller one.
    const [height1, width1] = size1.split('x').map(x => parseInt(x));
    const [height2, width2] = size2.split('x').map(x => parseInt(x));
    const MIN_WIDTH = 400;
    const MIN_HEIGHT = 600;

    if (
      height1 >= MIN_HEIGHT &&
      height2 >= MIN_HEIGHT &&
      width1 >= MIN_WIDTH &&
      width2 >= MIN_WIDTH
    ) {
      return height1 > height2 ? size2 : size1;
    }
    return height1 > height2 ? size1 : size2;
  }

  async setOptimalCameraSize() {
    if (this.state.cameraImageSize != null) {
      return;
    }
    const imageSizes = await this.camera.getAvailablePictureSizesAsync('4:3');
    if (imageSizes.length == 0) {
      return;
    }
    const bestSize = imageSizes.slice(1).reduce(this.chooseBetterSize, imageSizes[0]);
    console.log('Available image size: ' + JSON.stringify(imageSizes));
    console.log('Chosen image size: ' + bestSize);
    this.setState({ cameraImageSize: bestSize });
  }

  handlePickImage = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.1
    }).then(result => {
      if (result.cancelled === false) {
        this.setState({
          image: result
        });
      }
    });
  };

  handleDreamButtonPress = () => {
    const { image } = this.state;
    console.log('SERVER URL: ' + SERVER_URL);
    const selectedLayers = this.props.layers.filter(layer => layer.selected);
    if (selectedLayers.length === 0) {
      alert('No layers selected. Please go to the Settings tab and select the layers to amplify');
      return;
    }
    if (image) {
      const uri = image.uri;
      let formData = new FormData();
      let uriParts = uri.split('.');
      let fileType = uriParts[uriParts.length - 1];

      this.setState({ dreamButtonDisabled: true });

      formData.append('file', {
        uri,
        name: `image.${fileType}`,
        type: `image/${fileType}`
      });

      formData.append('layer', JSON.stringify(selectedLayers[0]));

      let options = {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      };

      fetch(SERVER_URL + '/dream', options)
        .then(res => {
          alert('Voilà!');
          res
            .blob()
            .then(blo => {
              const fr = new FileReader();
              fr.readAsDataURL(blo);
              fr.onload = () => {
                const base64img = fr.result;
                this.setState({
                  processedImage: {
                    uri: base64img
                  },
                  dreamButtonDisabled: false
                });
              };
            })
            .catch(err => console.log(err));
        })
        .catch(err => {
          alert('Something went wrong');
          console.log(err);
          this.setState({
            dreamButtonDisabled: false
          });
        });
    } else {
      alert('No image picked!');
    }
  };
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
