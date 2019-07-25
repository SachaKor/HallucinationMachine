import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View, 
  Dimensions
} from 'react-native';

import  GalleryImage   from '../components/GalleryImage';
import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  render() {
    const homePic = {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Aurelia-aurita-3-0049.jpg'
    }
    const {height, width} = Dimensions.get('window')
    return (
    <View style={{ flex: 1 }}>
      <View style={{backgroundColor: "#eeeeee", paddingBottom: 20}}>
        <Text style={{ fontSize: 30, fontWeight: '700', paddingHorizontal: 20, paddingTop: 40 }}>
          Welcome to Hallucination Machine!
        </Text>
      </View>
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE",
        }}
      />
      <ScrollView scrollEventThrottle={16}>
        <View style={{ marginTop: 40, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: '700' }}>
            What is Hallucination Machine?
          </Text>
          <View
            style={{
                height: 1,
                width: "80%",
                backgroundColor: "#CED0CE",
              }}
          />
          <Text style={{ fontWeight: '100', marginTop: 10 }}>
            Hallucination Machine is an application based on the Google's DeepDream project.
          </Text>
          <View style={{ width: width - 40, height: 200, marginTop: 20 }}>
            <Image
                style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 5, borderWidth: 1, borderColor: '#dddddd' }}
                source={homePic}
            />
          </View>
          <Text style={{ fontWeight: '100', marginTop: 10 }}>
            The core of the app is a Convolutional Neural Network, which is originally designed to classify objects detected in the images.
            The goal of the DeepDream project was to explore what a complex Neural Network is actually perceiving in it's hidden layers.
            By reversing the classification process, such a Neural Network is capable of generating what we call a hallucination or a dream.
          </Text>
          <View style={{ flex: 1, marginTop: 40 }}>
          <Text style={{ fontSize: 24, fontWeight: '700' }}>
            How to dream? 
          </Text>
          <View
            style={{
                height: 1,
                width: "80%",
                backgroundColor: "#CED0CE",
              }}
          />
          <Text style={{ fontWeight: '100', marginTop: 10 }}>
            A Convolutional Neural Network is a structure composed of layers.
            Every layer contains multiple feature channels responsible of detecting specific features in the image.
            This can be a certain shape or a complex object, such as an eye or an animal.
            Hallucination Machine is designed to explore and play with the DeepDream. 
            To get a "dreamed" version of the picture of your choice, go to the Settings tab and select the layer and the feature channels you wish to enhance.
            Then navigate to the Camera tab, take a picture or select one from the gallery and press the Dream button.
            The process may take a couple of minutes. 
            Once the picture is ready, it will be displayed on the same screen.
            To have an idea of what kind of the results it can give, take a look at the gallery below.
          </Text>
        </View>
        <View style={{ flex: 1, marginTop: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: '700' }}>
              Gallery 
            </Text>
            <View
              style={{
                  height: 1,
                  width: "80%",
                  backgroundColor: "#CED0CE",
                }}
            />
          </View>
          <View style={{ height: 500, marginTop: 20}}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <GalleryImage imageUri={require('../assets/images/jellyfish0.jpg')} name='Jellyfish, layer conv2d0'/>
              <GalleryImage imageUri={require('../assets/images/jellyfish1.jpg')} name='Jellyfish, layer conv2d1'/>
              <GalleryImage imageUri={require('../assets/images/jellyfish2.jpg')} name='Jellyfish, layer conv2d2'/>
              <GalleryImage imageUri={require('../assets/images/jellyfish3.jpg')} name='Jellyfish, layer mixed3a'/>
              <GalleryImage imageUri={require('../assets/images/jellyfish4.jpg')} name='Jellyfish, layer mixed3b'/>
              <GalleryImage imageUri={require('../assets/images/jellyfish5.jpg')} name='Jellyfish, layer mixed4a'/>
              <GalleryImage imageUri={require('../assets/images/jellyfish6.jpg')} name='Jellyfish, layer mixed4b'/>
              <GalleryImage imageUri={require('../assets/images/jellyfish7.jpg')} name='Jellyfish, layer mixed4c'/>
              <GalleryImage imageUri={require('../assets/images/jellyfish8.jpg')} name='Jellyfish, layer mixed4d'/>
              <GalleryImage imageUri={require('../assets/images/jellyfish9.jpg')} name='Jellyfish, layer mixed4e'/>
              <GalleryImage imageUri={require('../assets/images/jellyfish10.jpg')} name='Jellyfish, layer mixed5a'/>
              <GalleryImage imageUri={require('../assets/images/jellyfish11.jpg')} name='Jellyfish, layer mixed5b'/>
              <GalleryImage imageUri={require('../assets/images/valencialayer7niter35.jpg')} 
                name='The church, layer mixed4c'/>
              <GalleryImage imageUri={require('../assets/images/valencialayer8niter35.jpg')} 
                name='The church, layer mixed4d'/>
              <GalleryImage imageUri={require('../assets/images/valencialayer9niter35.jpg')} 
                name='The church, layer mixed4e'/>
              <GalleryImage imageUri={require('../assets/images/valencialayer10niter35.jpg')} 
                name='The church, layer mixed5a'/>
              <GalleryImage imageUri={require('../assets/images/valencialayer11niter35.jpg')} 
                name='The church, layer mixed55'/>
              <GalleryImage imageUri={require('../assets/images/kalanchoe_mixed4a_0-3.jpg')} name='Flower, layer mixed4a, channels from 0 to 3'/>
              <GalleryImage imageUri={require('../assets/images/leaves_mixed4c_0-3.jpg')} name='Leaves, layer mixed4c, channels from 0 to 3'/>
              <GalleryImage imageUri={require('../assets/images/flowers_mixed4d_257.jpg')} name='Flowers, layer mixed4d, channel 257'/>
              <GalleryImage imageUri={require('../assets/images/flowers_mixed4b_100.png')} name='Flowers, layer mixed4b, channel 100'/>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
    )
  }
}

HomeScreen.navigationOptions = {
  header: null
};

function handleDeepDreamPress() {
  WebBrowser.openAuthSessionAsync(
    'https://en.wikipedia.org/wiki/DeepDream'
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee'
  },
  titleText: {
    fontSize: 35, 
    paddingTop: 30,
    color: 'rgba(0,0,0,0.4)',
    textAlign: 'center'
  },
  descriptionText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeImage: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10
  },
  deepDreamLinkText: {
    color: '#2e78b7'
  }
});
