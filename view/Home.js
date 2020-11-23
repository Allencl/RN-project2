import React, { Component } from 'react';

import { Linking,AsyncStorage,ToastAndroid,DeviceEventEmitter,StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Modal,Card, WhiteSpace, WingBlank, Button, Icon } from '@ant-design/react-native';

import WISHttpUtils from '@wis_component/http';   // http 


class HomeScreen extends Component{
    constructor(props) {
        super(props);
    
        this.state={
            visible: !true,    // 版本更新
            version:'1.0.1',  // 当前版本号

          codes:{
            "StoragePut":"10",//	入库操作
            "":"20",//	库内管理
            "Binding":"201",//	仓位绑定
            "CruiseLibrary":"202",//	巡库
            "Status1":"203",//	电池状态维护
            "Inventory1":"204",//	库内盘点
            "":"30",//	出库管理
            "Vehicle1":"301",//	提车
            "Refue1":"302",//	加油加气
            "Tool1":"303",//	工具发放出库
            "Affirm1":"304",//	确认放行
            "Associate":"305",//	交接确认
            
          }
        }
      }

    componentDidMount(){
        var {navigation} = this.props;


        // 退出登录
        this.listener =DeviceEventEmitter.addListener('globalEmitter_logOut',function(callBack){
            navigation.navigate('Login'); 
            callBack();
        });
    }

    componentWillUnmount(){
        this.listener.remove();
    }

    /**
     * 
     * @param {*} code 
     */
    onClose =()=> {
        this.setState({
            visible: false,
        });
    }

    /**
     * 下载 最新版
     * @param {*} code 
     */
    onDownload=()=>{
        var downloadURL = 'http://www.baidu.com/';  // 下载页面         
  
        Linking.canOpenURL(downloadURL).then(supported => {         
            if (!supported) {            
                console.warn('Can\'t handle url: ' + downloadURL);            
            } else {            
                return Linking.openURL(downloadURL);            
            }            
        }).catch(err => console.error('An error occurred',downloadURL));           
    }

    async authority (code){
        const {navigation} = this.props;
        const {codes} =this.state;
        let params={
            werks: await AsyncStorage.getItem("werks"),
            lgort: await AsyncStorage.getItem("lgort"),
            bname: await AsyncStorage.getItem("userName"),
            bcode: await AsyncStorage.getItem("bcode"),
            zcode: codes[code],
        }
    navigation.navigate(code)
        // WISHttpUtils.post("app/user/auth", params, (result) => {
        //     if(result.data.STATUS==="S"){
        //       //跳转页面
        //       navigation.navigate(code)
        //     }else{
        //         ToastAndroid.show(result.data.MESSAGE,ToastAndroid.SHORT);
        //     }
          
        //   });
    }

  render() {
    const {navigation} = this.props;
    const {version}=this.state;

    return (
      <ScrollView style={styles.page}>

        <Modal
          title="版本更新"
          transparent
          onClose={this.onClose}
          maskClosable
          visible={this.state.visible}
          closable
        //   footer={footerButtons}
        >
          <View style={{ paddingVertical: 20 }}>
              <View style={styles.versionContent}>
                <Text style={{ fontSize:16 }}>当前版本：</Text>
                <Text style={{ fontSize:16 }}>1.0.1</Text>
              </View>
              <View style={styles.versionContent}>
                <Text style={{ fontSize:16 }}>更新版本：</Text>
                <Text style={{ fontSize:16 }}>1.0.3</Text>
              </View>

              <View style={{paddingTop:8}}>
                <Button type="primary" onPress={this.onDownload}>点击下载安装版</Button>
              </View>
          </View>
          <Button type="ghost" onPress={this.onClose}>取消</Button>
        </Modal>



        <WingBlank size="md" style={styles.wingBlank}>
          <Card style={styles.card}>
            <Card.Header
              title="入库操作"
              thumb={<Icon name="carry-out" size="md" color="#009966" style={{marginRight:6}} />}
            />
            <Card.Body>
                <View>
                    <View  style={styles.menu_box}>
                        <TouchableOpacity onPress={() => this.authority('StoragePut') }>
                            <View style={styles.menu_child}>
                                <Icon style={styles.menu_child_icon} name="check-square" size="lg" color="#ff9933" />
                                <Text style={styles.menu_child_text}>入库操作</Text>
                            </View>
                        </TouchableOpacity>
                    </View>                       
                </View>         
            </Card.Body>
          </Card>

          <Card style={styles.card}>
            <Card.Header
              title="库内操作"
              thumb={<Icon name="database" size="md" color="#003399" style={{marginRight:6}} />}
            />
            <Card.Body>
                <View>
                    <View style={styles.menu_box}>
                        <TouchableOpacity onPress={() => this.authority('Binding') }>
                            <View style={styles.menu_child}>
                                <Icon style={styles.menu_child_icon} name="lock" size="lg" color="#009966" />
                                <Text style={styles.menu_child_text}>仓位绑定</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.authority('CruiseLibrary') }>
                            <View style={styles.menu_child}>
                                <Icon style={styles.menu_child_icon} name="bulb" size="lg" color="#003399" />
                                <Text style={styles.menu_child_text}>巡库</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.authority('Status1') }>
                            <View style={styles.menu_child}>
                                <Icon style={styles.menu_child_icon} name="thunderbolt" size="lg" color="#ff9933" />
                                <Text style={styles.menu_child_text}>电池维护</Text>
                            </View>  
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.authority('Inventory1') }>
                            <View style={styles.menu_child}>
                                <Icon style={styles.menu_child_icon} name="edit" size="lg" color="#009966" />
                                <Text style={styles.menu_child_text}>库内盘点</Text>
                            </View>    
                        </TouchableOpacity>

                    </View>                       
                </View>         
            </Card.Body>
          </Card>

          <Card style={styles.card}>
            <Card.Header
              title="出库操作"
              thumb={<Icon name="coffee" size="md" color="#ff9933" style={{marginRight:6}} />}
            />
            <Card.Body>
                <View>
                    <View style={styles.menu_box}>
                        <TouchableOpacity onPress={() => this.authority('Vehicle1') }>
                            <View style={styles.menu_child}>
                                <Icon style={styles.menu_child_icon} name="car" size="lg" color="#003399" />
                                <Text style={styles.menu_child_text}>提车</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.authority('Refue1') }>
                            <View style={styles.menu_child}>
                                <Icon style={styles.menu_child_icon} name="environment" size="lg" color="#ff9933" />
                                <Text style={styles.menu_child_text}>加油加气</Text>
                            </View>
                        </TouchableOpacity>


                        
                        <TouchableOpacity onPress={() => this.authority('Tool1') }>
                            <View style={styles.menu_child}>
                                <Icon style={styles.menu_child_icon} name="tool" size="lg" color="#003399" />
                                <Text style={styles.menu_child_text}>工具发放</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.authority('Affirm1') }>
                            <View style={styles.menu_child}>
                                <Icon style={styles.menu_child_icon} name="coffee" size="lg" color="#009966" />
                                <Text style={styles.menu_child_text}>出厂确认</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.authority('Associate') }>
                            <View style={styles.menu_child}>
                                <Icon style={styles.menu_child_icon} name="coffee" size="lg" color="#003399" />
                                <Text style={styles.menu_child_text}>交接确认</Text>
                            </View>    
                        </TouchableOpacity>


                    </View>                       
                </View>         
            </Card.Body>
          </Card>


          <View style={styles.footer}><Text>——到底了——</Text></View>
        </WingBlank>
      </ScrollView>
    );
  }
}



const styles = StyleSheet.create({
    versionContent:{
        flexDirection:'row',
        paddingBottom:12
        // justifyContent:'space-between',        
    },
    page:{ 
        backgroundColor:"white"
    },
    wingBlank:{
        paddingBottom:50
    },
    card:{
        marginTop:16
    },
    menu_box: {
        flexDirection: "row",
        flexWrap:"wrap",
        // height: 100,
        // padding: 12
        paddingTop:10,
        paddingLeft:12,
        paddingRight:12,
    },
    menu_child: {
        justifyContent: 'center',
        alignItems: 'center',
        width:90,
        height:90,   
        borderWidth: 1,
        borderColor: "#dcdee2",
        borderRadius: 3,
        marginRight:12,
        marginBottom:12,
        paddingLeft:6,
        paddingRight:6
    },
    menu_child_text: {
        marginTop:3,
        fontSize:16,
        paddingTop:3
    },
    footer:{
        justifyContent: 'center',
        alignItems: 'center',  
        paddingTop:16, 
        fontSize:12
    },
    menu_child_icon:{
        fontSize:30
    }
  });

export default HomeScreen;
