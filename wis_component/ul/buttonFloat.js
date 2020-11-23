import React, { Component } from 'react';
import { TouchableOpacity,StyleSheet, Button, View, Text } from 'react-native';


class ButtonComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {children}=this.props;

    return (
      <View style={{position:'absolute',right:20,bottom:50}}>
        { children.map(o=>{
          return <TouchableOpacity onPress={()=> o["onPress"]&&o["onPress"](o) }>
            <View style={{...styles.buttonCircle,
              backgroundColor:o['backgroundColor']?o['backgroundColor']:'#13c2c2'
            }}>
              <Text style={styles.buttonCircleText}>{o['text']}</Text>
            </View>
          </TouchableOpacity>          

        })

        }
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonCircle:{
    marginTop:10,
    paddingTop:22,
    width:66,
    height:66,
    borderRadius:66,
    
  },
  buttonCircleText:{
    fontSize:16,
    color:'#fff',
    fontWeight: "bold",
    textAlign: 'center',
  }
});


export default ButtonComponent;

