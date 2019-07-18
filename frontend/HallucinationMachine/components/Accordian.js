// The code has been taken from:
// https://medium.com/@KPS250/creating-an-accordion-in-react-native-f313748b7b46

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, CheckBox, Picker } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { setLayerChecked, updateLayer } from '../actions'

class Accordian extends React.PureComponent {

  state = { 
    expanded: false,
    pickerItems: []
  }

  componentDidMount() {
    const pickerNumbers = [...Array(this.props.nbChannels).keys()].map(nb => nb.toString());
    this.setState({
      pickerItems: pickerNumbers
    })
  }

  getLayer = () => {
    const layer = this.props.layers.filter(l => l.name === this.props.title)[0]
    return layer
  }
  
  render() {
    const { checked, pickerItems, channelFrom, channelTo, expanded } = this.state;
    const { title } = this.props;
    const layer = this.getLayer()
    return (
       <View>
            <TouchableOpacity style={styles.row} onPress={()=>this.toggleExpand()}>
                <CheckBox value={layer.selected} onValueChange={this.handleCheckboxPressed}/>
                <Text style={[styles.title, styles.font]}>{title}</Text>
                <Ionicons name={expanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} size={30} color='#000' />
            </TouchableOpacity>
            <View style={styles.parentHr}/>
            {
                this.state.expanded &&
                <View style={styles.child}>
                    <View><Text>From</Text></View>
                    <View>
                    <Picker
                      selectedValue={layer.fromChannel.toString()}
                      onValueChange={this.handleChannelFromChanged}>
                      {
                        pickerItems.map(item => <Picker.Item label={item} value={item} key={item}/>)
                      }
                    </Picker>
                    </View>
                    <View
                      style={{
                        height: 1,
                        width: "100%",
                        backgroundColor: "#CED0CE",
                      }}
                    />
                    <View>
                    <View><Text>To</Text></View>
                    <Picker
                      selectedValue={layer.toChannel.toString()}
                      onValueChange={this.handleChannelToChanged}>
                      {
                        pickerItems.map(item => <Picker.Item label={item} value={item} key={item}/>)
                      }
                    </Picker>
                    </View>
                </View>
            }
       </View>
    )
  }

  handleCheckboxPressed = () => {
    this.props.setLayerChecked(this.props.title)
  }

  handleChannelFromChanged = (itemValue, itemIndex) => {
    var layer = this.getLayer();
    const value = parseInt(itemValue)
    layer.fromChannel = value > layer.toChannel ? layer.toChannel : value;
    this.props.updateLayer(layer);
  }

  handleChannelToChanged = (itemValue, itemIndex) => {
    var layer = this.getLayer();
    const value = parseInt(itemValue)
    layer.toChannel = value < layer.fromChannel ? layer.fromChannel : value;
    this.props.updateLayer(layer)
  }
  
  toggleExpand = () => {
    this.setState({expanded : !this.state.expanded})
  }

}

const mapStateToProps = state => ({
  layers: state.Layers.layerData
});

const mapDispatchToProps = dispatch => ({
  setLayerChecked: layerName => dispatch(setLayerChecked(layerName)),
  updateLayer: layer => dispatch(updateLayer(layer))
})

export default connect(mapStateToProps, mapDispatchToProps)(Accordian)

const styles = StyleSheet.create({
    title: {
        fontSize: 14,
        fontWeight:'bold',
        color: '#555',
    },
    row: {
        flexDirection: 'row',
        justifyContent:'space-between',
        height:56,
        paddingLeft:25,
        paddingRight:18,
        alignItems:'center',
        backgroundColor: '#fff',
    },
    parentHr: {
        height: 1,
        color: '#fff',
        width:'100%'
    },
    child: {
        backgroundColor: '#eee',
        padding: 16
    }
    
});