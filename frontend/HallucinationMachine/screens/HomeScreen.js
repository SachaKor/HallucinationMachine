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
} from 'react-native';

import { MonoText } from '../components/StyledText';

export default function HomeScreen() {
  let homePic = {
    uri: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Aurelia-aurita-3-0049.jpg'
  }
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <View>
          <Text style={styles.titleText}>
            Hallucination machine
          </Text>
        </View>
        <View style={styles.welcomeContainer}>
          <Image
            source={homePic}
            style={styles.welcomeImage}
          />
        </View>

        <View style={styles.descriptionText}>
        <Text> 
          This is an application based on Google's DeepDream project!!!
        </Text>
        <Text onPress={handleDeepDreamPress} style={styles.deepDreamLinkText}>
          Learn more
        </Text>
        </View>
      </ScrollView>
    </View>
  );
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
