
import React from "react";
import { Text, FlatList, View } from "react-native";
import { ListItem, Button } from "react-native-elements";
import Accordian from "../components/Accordian";
import { SERVER_URL } from 'react-native-dotenv';
import { connect } from 'react-redux';
import { addLayer, removeLayer } from '../actions';


class SettingsScreen extends React.PureComponent {
  
  // data containss layer info
  state = {
    data: []
  }

  componentDidMount() {
    console.log('SERVER URL: ' + SERVER_URL)
    console.log('Getting layers info from server....');
    fetch(SERVER_URL + '/layers')
      .then(res => res.json())
      .then(resJson => {
        console.log('Layers info loaded')
        const newData = resJson.map(item => {
          return {...item, ...{selected: false, fromChannel: 0, toChannel: item.nbChannels-1}}
        })
        this.setState({data: newData})
        console.log("Number of layers: " + newData.length)
      })
      .catch(err => console.log(err))
  }

  render() {
    console.log('SettingsScreen PROPS: ' + JSON.stringify(this.props))
    return (
      <View>
        <FlatList
          data={this.state.data}
          extraData={this.state}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
          keyExtractor={item => item.name}
          ListFooterComponent={this.renderSeparator}
        />
        <Button title='Pum' onPress={this.handleButtonPressed}/>
      </View>
    )
  }

  onCheckBoxPressed = (title, channelFrom, channelTo) => {
    // redux store
    var newData = this.state.data;
    const layer = newData.find((layer) => layer.name === title)
    if (layer.selected) {
      this.props.removeLayer(title)
    } else {
      const layer = {
        name: title, 
        fromChannel: channelFrom, 
        toChannel: channelTo
      }
      this.props.addLayer(layer)
    }
    newData = newData.map(item => {
      var temp = {...item}
      if (item.name === title) {
        temp.selected = !temp.selected
        temp.fromChannel = channelFrom
        temp.toChannel = channelTo
        return temp
      }
      return item
    })
    this.setState({
      data: newData
    });
    
  }

  renderItem = ({item}) => (
    <Accordian
      title={item.name}
      nbChannels={item.nbChannels}
      onCheckboxPressed={this.onCheckBoxPressed}
    />
  )

  handleButtonPressed = () => {
    alert('Pum!');
    const {data} = this.state;
    console.log(JSON.stringify(data))
  };

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

const mapStateToProps = state => ({
  layers: state.Layers.layersData
});

const mapDispatchToProps = dispatch => ({
  addLayer: layer => dispatch(addLayer(layer)),
  removeLayer: layerName => dispatch(removeLayer(layerName))
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)