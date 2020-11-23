import React, { Component } from 'react';
import { StyleSheet, ScrollView, View,  AsyncStorage, ToastAndroid,  } from 'react-native';
import { WingBlank, DatePicker, List, Tag, WhiteSpace, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera, } from '@wis_component/form';   // form 
import { WisTable, } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 
import {getNowDate,getNowTime,getDate} from '../../utils/date';

// 交接确认
class PageForm extends Component {
  constructor(props) {
    super(props);

    this.state={
      equnr:'设备号',
      matnr:'产品代码',
      maktx:'产品描述',
      zvand:'承运商编号',
      zvandn:'承运商名称',
    }
  }

  static propTypes = {
    form: formShape,
  };
  componentDidMount(){
    this.getData( "LG6ZNDNH3LX092205"   );
  }
  async getData(equnr){
    let that=this;
    let params={
    werks: await AsyncStorage.getItem("werks"),
    lgort: await AsyncStorage.getItem("lgort"),
    equnr:equnr};
    WISHttpUtils.post("app/delivery/getVehicleFactoryInformation",params, (result) => {
      let data=result.data;
      if(data&&data.STATUS==='S'){
        that.setState({
          equnr:data.EQUNR,
          matnr:data.MATNR,
          maktx:data.MAKTX,
          zvand:data.ZVAND,
          zvandn:data.ZVANDN,
        });
      }else{
        ToastAndroid.show(data.MESSAGE,ToastAndroid.SHORT);          
      }
    });
  }
  /**
   * 提交
   * @param
   */
  submit = async () => {
    let that=this;
    let werks = await AsyncStorage.getItem("werks");
    let lgort = await AsyncStorage.getItem("lgort");
    that.props.form.validateFields((error, value) => {
        // 表单 不完整
        if(error){
          Toast.fail('必填字段未填!');
        } else{
          value.werks=werks;
          value.lgort=lgort;
          //T：提车确认C：出厂确认J：交接确
          value.zccode="J";
          value.equnr=that.state.equnr;
          // 保存数据
          WISHttpUtils.post("app/delivery/updateVehicleFactoryInformation",value, (result) => {
            let data=result.data;
            if(data.STATUS==="S"){
              ToastAndroid.show(data.MESSAGE,ToastAndroid.SHORT); 
              that.setState({
                equnr:'',
                matnr:'',
                maktx:'',
                zvand:'',
                zvandn:'',
              });
              that.props.form.resetFields();
            }else{
              ToastAndroid.show(data.MESSAGE,ToastAndroid.SHORT);          
            }
          });
        }
    });
  }
  



  render() {
    const {navigation} = this.props;
    const {equnr,matnr,maktx,zvand,zvandn}=this.state;

    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    return (
      <ScrollView style={{flex:1,backgroundColor:"white"}}>

        <List 
          style={{paddingBottom:50}}
          renderHeader={<WisFormHead/>} 
        >


            <WisCamera      
                  lableName="VIN码"
                  defaultValue={equnr}
                  onChangeValue={(data)=>{
                    this.getData(data.data)
                  }}
            />

            <WisInput  
                {...getFieldProps('matnr',{
                rules:[{required:false }],
                initialValue:matnr
                })} 
                error={getFieldError('matnr')}               
                lableName="产品代码"
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

          <WisInput  
                {...getFieldProps('zvand',{
                rules:[{required:false }],
                initialValue:zvand
                })} 
                error={getFieldError('zvand')}               
                lableName="承运商编码"
                disabled
            />
            <WisInput  
                {...getFieldProps('zvandn',{
                rules:[{required:false }],
                initialValue:zvandn
                })} 
                error={getFieldError('zvandn')}               
                lableName="承运商名称"
                disabled
            />

        </List>
      
      

        <View style={{height:60,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16}}>
          <Button type="ghost" onPress={this.submit}>确认交接</Button>
        </View>
      
      </ScrollView>
    );
  }
}



export default createForm()(PageForm);

