import React, { Component } from 'react';
import { StyleSheet, ScrollView, View,  AsyncStorage, ToastAndroid,  } from 'react-native';
import { WingBlank, DatePicker, List, Tag, WhiteSpace, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea, } from '@wis_component/form';   // form 
import { WisTable, } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 
import {getNowDate,getNowTime,getDate} from '../../utils/date';

// 工具发放出库 4
class PageForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      equnr:'',
      maktx:'产品描述',
      zobdq:'问题',
    };
  }

  static propTypes = {
    form: formShape,
  };

  componentDidMount(){
    this.getData();
  }
   getData(){
    let that=this;
    let routeParams = that.props.route.params.routeParams;
    that.setState({
      equnr:routeParams.equnr,
      maktx:routeParams.maktx,
      zcode:routeParams.zcode,
      zvand:routeParams.zvandn,
      zvandn:routeParams.zvand,
      zrnum:routeParams.zrnum,
      znnum:routeParams.znnum,
    });
  }

  /**
   * 强制出库提交
   * @param
   */
   submit= async() =>{
    let that=this;
    let werks = await AsyncStorage.getItem("werks");
    let lgort = await AsyncStorage.getItem("lgort");
    let userName = await AsyncStorage.getItem("userName");
    const {navigation} = that.props;
    that.props.form.validateFields((error, value) => {
        // 表单 不完整
        if(error){
          Toast.fail('必填字段未填!');
        } else{
          value.werks=werks;
          value.lgort=lgort;
          value.zcnam=userName;
          value.zcdat=getNowDate();
          // 保存数据
          WISHttpUtils.post("app/delivery/confirmVehicleDelivery",value, (result) => {
            let data= result.data;
            if(data.STATUS==="S"){
             
              navigation.navigate('Tool3')
            }else{
              ToastAndroid.show(header.MESSAGE,ToastAndroid.SHORT);    
            }
          });
        }
    });
  }
  /**
   * 记录问题
   */
   abnormal= async() =>{
    let that=this;
    let werks = await AsyncStorage.getItem("werks");
    let lgort = await AsyncStorage.getItem("lgort");
    let userName = await AsyncStorage.getItem("userName");
    const {navigation} = this.props;
    that.props.form.validateFields((error, value) => {
        // 表单 不完整
        if(error){
          Toast.fail('必填字段未填!');
        } else{
          value.werks=werks;
          value.lgort=lgort;
          value.zcnam=userName;
          value.zcdat=getNowDate();
          // 保存数据
          WISHttpUtils.post("app/delivery/saveVehicleDeliveryProblem",value, (result) => {
            let data= result.data;
            if(data.STATUS==="S"){
              navigation.navigate('Tool3')
            }else{
              ToastAndroid.show(header.MESSAGE,ToastAndroid.SHORT);    
            }
          });
        }
    });
  }

  render() {
    const {navigation} = this.props;
    const {equnr,maktx,zobdq,}=this.state;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    return (
      <ScrollView style={{flex:1,backgroundColor:"white"}}>

        <List 
          style={{paddingBottom:50}}
          renderHeader={<WisFormHead/>} 
        >

            <WisInput  
                {...getFieldProps('equnr',{
                rules:[{required:false }],
                initialValue:equnr
                })} 
                error={getFieldError('equnr')}               
                lableName="VIN码"
                disabled
            />


            <WisInput  
                {...getFieldProps('maktx',{
                rules:[{required:false }],
                initialValue:maktx
                })} 
                error={getFieldError('maktx')}               
                lableName="产品描述"
                disabled
            />

            <WisTextarea 
              {...getFieldProps('zobdq',{
                  initialValue:zobdq
              })} 
              error={getFieldError('zobdq')}         
              lableName="异常问题"
            />

 
        </List>
      
      

        <View style={{height:60,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16}}>
          <Button type="ghost" onPress={this.submit}>强制出库</Button>
          <Button type="ghost" onPress={this.abnormal}>返厂维修</Button>
        </View>
      
      </ScrollView>
    );
  }
}



export default createForm()(PageForm);

