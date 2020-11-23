import React from 'react';
import { DeviceEventEmitter,TouchableOpacity, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Provider, InputItem, List, Toast,Icon } from '@ant-design/react-native';


class CenterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }



  render() {
    const {onClose} = this.props;

    return (
      <View styl={styles.container}>
          <View style={styles.headContainer}>
            <View style={styles.imgBox}>
              <Image
                style={styles.img}
                source={require('./img/head.jpg')}
              />   
            </View>
            <View style={styles.textBox}>
              <View style={{...styles.textDIV,paddingTop:26}}>
                <Text style={{fontSize:20,color:"#fff"}}>李某某</Text> 
              </View>   
              <View style={styles.textDIV}>
                <Text style={{fontSize:18,color:"#fff"}}>部门经理</Text> 
              </View>   
              <View style={styles.textDIV}>
                <Text style={{fontSize:18,color:"#fff"}}>dsdsdsd@qq.com</Text> 
              </View>   
            </View>
          </View>

          <View style={{paddingTop:12}}>
            <TouchableOpacity onPress={()=>{
              // 退出登录
              DeviceEventEmitter.emit('globalEmitter_logOut',()=> onClose());
            }}>
              <View style={styles.footerBtn}>
                <Text style={styles.btnFont}>退出登录</Text>
                <Icon style={styles.btnIcon} name="right" size="sm" />
              </View>
            </TouchableOpacity>        
          </View>

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headContainer:{
    flexDirection:'column',
    // justifyContent:'center',
    backgroundColor:"#13c2c2",    
    height:320,
    paddingTop:39  
  },
  imgBox:{
    flexDirection:'row',
    justifyContent:'center',
  },
  textBox:{
    flexDirection:'column',
    // justifyContent:'center',    
  },
  textDIV:{
    flexDirection:'row',
    justifyContent:'center',
    paddingTop:8,
    paddingBottom:8
  },
  img:{
    width:120,
    height:120,
    borderRadius:60
  },
  footerBtn:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:12,
    borderBottomWidth:1,
    borderBottomColor:"#e9e9e9"
    // backgroundColor:"red"
  },
  btnFont:{
    fontSize:18
  },
  btnIcon:{
    paddingRight:12,
    color:"#404040"
  }
});


export default CenterPage;