// The code has been taken from:
// https://medium.com/@KPS250/creating-an-accordion-in-react-native-f313748b7b46

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, CheckBox, Picker } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default class Accordian extends React.PureComponent {

  state = { 
    expanded: false,
    checked: false,
    pickerItems: [],
    channelFrom: null,
    channelTo: null
  }

  componentDidMount() {
    const pickerNumbers = [...Array(this.props.nbChannels).keys()].map(nb => nb.toString());
    this.setState({
      pickerItems: pickerNumbers,
      channelFrom: pickerNumbers[0],
      channelTo: pickerNumbers[pickerNumbers.length-1]
    })
  }
  
  render() {
    const { checked, pickerItems, channelFrom, channelTo, expanded } = this.state;
    const { title } = this.props;
    return (
       <View>
            <TouchableOpacity style={styles.row} onPress={()=>this.toggleExpand()}>
                <CheckBox value={checked} onValueChange={this.handleCheckboxPressed}/>
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
                      selectedValue={channelFrom}
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
                      selectedValue={channelTo}
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
    const { checked } = this.state;
    this.setState({
      checked: !checked
    })
    const { channelFrom, channelTo } = this.state; 
    console.log("selected channels: " + channelFrom + " " + channelTo)
    return this.props.onCheckboxPressed(this.props.title, parseInt(channelFrom, 10), parseInt(channelTo, 10))
  }

  handleChannelFromChanged = (itemValue, itemIndex) => {
    const { channelTo } = this.state
    this.setState({channelFrom: itemValue > channelTo ? channelTo : itemValue});
  }

  handleChannelToChanged = (itemValue, itemIndex) => {
    const { channelFrom } = this.state
    this.setState({channelTo: itemValue < channelFrom ? channelFrom : itemValue});
  }
  
  toggleExpand = () => {
    this.setState({expanded : !this.state.expanded})
  }

}

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