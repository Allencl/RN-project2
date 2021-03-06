import React, { Component } from 'react';
import { Dimensions,StyleSheet,ActivityIndicator,DeviceEventEmitter,TouchableOpacity, View, Text, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, Provider, Drawer } from '@ant-design/react-native';
import BarBottom from './view/BarBottom';   // 底部按钮
import CenterScreen from './view/Center';       // 个人中心




// 页面
import HomeScreen from './view/Home';    // 主页
import LoginScreen from './view/Login';   // 登录

import taskScreen from './view/task/index';   // 代办任务
import procurementOrderScreen from './view/procurementOrder/index';   // 采购订单
import procurementPlanScreen from './view/procurementPlan/index';     // 采购计划



import Config from 'react-native-config';
const base_url=Config.base_url;





//------------------------------  react func  ----------------------------------------------

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

class App extends Component {
  constructor (props) {
    super(props);

    this.state={
      activityIndicatorVisible: false,    // loding
    }  
  }
  
  componentDidMount() {
    let that=this;

    // loding
    this.listener =DeviceEventEmitter.addListener('globalEmitter_toggle_loding',function(active){
      that.setState({
        activityIndicatorVisible:active
      });
    });

  }

  componentWillUnmount(){
    this.listener.remove();
  }

  render() {
    let that=this;
    let {activityIndicatorVisible}=this.state;

    // 公共头部
    let headOption={
      headerStyle: {
        backgroundColor: '#13c2c2',
        borderWidth:0
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: (props) => (
        <TouchableOpacity onPress={() =>{ 
          this.drawer.openDrawer();
          DeviceEventEmitter.emit('globalEmitter_get_login_config');
        }}>
          <View style={{paddingTop:5,paddingRight:20}}><Icon style={{color:"#fff"}} name={"setting"}/></View>
        </TouchableOpacity> ),

    }


    return(
      <Provider>
        { activityIndicatorVisible ?
          <View style={{...styles.activityIndicatorStyle,width:Dimensions.get('window').width,height:Dimensions.get('window').height}}>
            <ActivityIndicator size="large" color="#13c2c2" />
          </View>
          :
          <View></View>
        }



        <Drawer
          sidebar={<CenterScreen onClose={()=> that.drawer.closeDrawer() } />}
          position="left"
          // open={false}
          drawerRef={el => (this.drawer = el)}
          // onOpenChange={this.onOpenChange}
          drawerBackgroundColor="#fff"
        >

        {/* 菜单 */}
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">

            <Stack.Screen name="Login"
              options={{
                title:' ',
                headerShown: false
              }} 
              component={LoginScreen} 
            />
            
            <Stack.Screen name="Home" options={{title:'首页',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="Home" component={HomeScreen} />
                </Tab.Navigator>
              )}
            </Stack.Screen>  

            <Stack.Screen name="task" options={{title:'代办任务',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="task" component={taskScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>

            <Stack.Screen name="procurementOrder" options={{title:'采购订单',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="procurementOrder" component={procurementOrderScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>

            <Stack.Screen name="procurementPlan" options={{title:'采购计划',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="procurementPlan" component={procurementPlanScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>            


            
          </Stack.Navigator>
        </NavigationContainer>
      
      
      </Drawer>
      </Provider>
    );
  }  
}


const styles = StyleSheet.create({
  activityIndicatorStyle:{
    position:"absolute",
    top:0,
    left:0,
    zIndex:999999,
    justifyContent:'center',
    backgroundColor:'#dde5dd24'
  }
})

export default App;