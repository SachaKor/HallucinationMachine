
import React from "react";
import { Text, FlatList, View } from "react-native";
import { ListItem, Button } from "react-native-elements";
import Accordian from "../components/Accordian";
import { SERVER_URL } from 'react-native-dotenv';
import { connect } from 'react-redux';
import { addLayer, removeLayer, addLayerData } from '../actions';


class SettingsScreen extends React.PureComponent {

  componentDidMount() {
    console.log('SERVER URLL: ' + SERVER_URL)
    console.log('Getting layers info from server....');
    fetch(SERVER_URL + '/layers')
      .then(res => res.json())
      .then(resJson => {
        console.log('Layers info loaded')
        const newData = resJson.map(item => {
          return {...item, ...{selected: false, fromChannel: 0, toChannel: item.nbChannels-1}}
        })
        this.props.addLayerData(newData)
        console.log("Number of layers: " + newData.length)
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.props.layers}
          extraData={this.state}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
          keyExtractor={item => item.name}
          ListFooterComponent={this.renderSeparator}
        />
      </View>
    )
  }

  renderItem = ({item}) => (
    <Accordian
      title={item.name}
      nbChannels={item.nbChannels}
    />
  )

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };
}

// redux
const mapStateToProps = state => ({
  layers: state.Layers.layerData
});

const mapDispatchToProps = dispatch => ({
  addLayer: layer => dispatch(addLayer(layer)),
  removeLayer: layerName => dispatch(removeLayer(layerName)),
  addLayerData: layerData => dispatch(addLayerData(layerData))
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)