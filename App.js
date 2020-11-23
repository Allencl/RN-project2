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
import procurementOrderScreen from './view/procurement/order';   // 采购订单
import procurementPlanScreen from './view/procurement/plan';   // 采购计划



import Config from 'react-native-config';
const base_url=Config.base_url;





//------------------------------  react func  ----------------------------------------------

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

class App extends Component {
  constructor (props) {
    super(props)
    // console.log('BASE_URL', Config)
  }
  componentDidMount=async() => {
    // await AsyncStorage.setItem("werks","1031");
    // await AsyncStorage.setItem("lgort","3005");
    // await AsyncStorage.setItem("userName","XX-DENGSL")
    // await AsyncStorage.setItem("bcode","1234qwer")
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



export default App;