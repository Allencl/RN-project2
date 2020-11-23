import React, { Component } from 'react';
import { TouchableOpacity, View, Text, AsyncStorage } from 'react-native';
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





import StoragePutScreen from './view/storagePut/index';        // 入库操作
import RejectionScreen from './view/storagePut/rejection';     // 拒收


import BindingScreen from './view/warehouseIn/binding';                 // 库内操作 仓位绑定
import CruiseLibraryScreen from './view/warehouseIn/cruiseLibrary';     // 库内操作 巡库
import ConventionScreen from './view/warehouseIn/convention';           // 库内操作 巡库 日常巡库
import ConventionScreen2 from './view/warehouseIn/convention2';           // 库内操作 巡库 日常巡库2

import IssueScreen from './view/warehouseIn/issue';   // 库内操作 巡库问题项1
import IssueScreen2 from './view/warehouseIn/issue2';   // 库内操作 巡库问题项2

import StatusScreen1 from './view/warehouseIn/status1';   // 库内操作 电池状态维护1
import StatusScreen2 from './view/warehouseIn/status2';   // 库内操作 电池状态维护2
import StatusScreen3 from './view/warehouseIn/status3';   // 库内操作 电池状态维护3

import InventoryScreen1 from './view/warehouseIn/inventory1';   // 库内操作 库内盘点1
import InventoryScreen2 from './view/warehouseIn/inventory2';   // 库内操作 库内盘点2

import VehicleScreen1 from './view/delivery/vehicle1';   // 出库操作 提车1
import VehicleScreen2 from './view/delivery/vehicle2';   // 出库操作 提车2
import VehicleScreen3 from './view/delivery/vehicle3';   // 出库操作 提车3

import RefueScreen1 from './view/delivery/refue1';   // 出库操作 加油加气1
import RefueScreen2 from './view/delivery/refue2';   // 出库操作 加油加气2
import RefueScreen3 from './view/delivery/refue3';   // 出库操作 加油加气3

import ToolScreen1 from './view/delivery/tool1';   // 出库操作 工具发放出库1
import ToolScreen2 from './view/delivery/tool2';   // 出库操作 工具发放出库2
import ToolScreen3 from './view/delivery/tool3';   // 出库操作 工具发放出库3
import ToolScreen4 from './view/delivery/tool4';   // 出库操作 工具发放出库4

import AffirmScreen1 from './view/delivery/affirm1';   // 出库操作 出厂确认1
import AffirmScreen2 from './view/delivery/affirm2';   // 出库操作 出厂确认2
import AssociateScreen from './view/delivery/associate';   // 出库操作 交接确认

import Config from 'react-native-config';
const base_url=Config.base_url;





//------------------------------  react func  ----------------------------------------------

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

class App extends Component {
  constructor (props) {
    super(props)
    console.log('BASE_URL', Config)
  }
  componentDidMount=async() => {
    await AsyncStorage.setItem("werks","1031");
    await AsyncStorage.setItem("lgort","3005");
    await AsyncStorage.setItem("userName","XX-DENGSL")
    await AsyncStorage.setItem("bcode","1234qwer")
  }

  openDrawer(){

  }

  render() {
    let that=this;

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
        <TouchableOpacity onPress={() => this.drawer.openDrawer() }>
          <View style={{paddingTop:5,paddingRight:20}}><Icon style={{color:"#fff"}} name={"setting"}/></View>
        </TouchableOpacity> ),

    }


    return(
      <Provider>

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
          <Stack.Navigator initialRouteName="Home">

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



            
          </Stack.Navigator>
        </NavigationContainer>
      
      
      </Drawer>
      </Provider>
    );
  }  
}



export default App;