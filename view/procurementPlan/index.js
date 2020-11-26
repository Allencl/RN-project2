import React, { Component } from 'react';
import { Dimensions,StyleSheet, ScrollView, View,Text,  AsyncStorage, ToastAndroid,Button   } from 'react-native';
import { SegmentedControl,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,  } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 

import PendingPage from './pending.js';  // 待下发
import AllPage from './all.js';  // 全部




// 采购计划
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      togglePage:0,  // 切换页面
    }
  }
  componentDidMount(){

  }


  /**
   * change 头
   */
  onChangeHead=(option)=>{
    this.setState({
      togglePage:option.nativeEvent.selectedSegmentIndex
    });
  }


  render() {
    let {currentPage,totalPage,togglePage} = this.state;
    let {navigation} = this.props;

    return (
        <View style={{height:Dimensions.get('window').height-131}}>
          <SegmentedControl 
            size="lg" 
            style={{height:50,padding:6,borderColor:'#fff',backgroundColor:'#fff'}}
            values={['待下发', '全部']} 
            tintColor="#13c2c2" 
            onChange={(option)=> this.onChangeHead(option)}
          />

          { togglePage==0 ?
             <PendingPage />
             :   
             <AllPage />
          }
          

        </View>
    );
  }
}



export default PageForm;

