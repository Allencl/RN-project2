import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, AsyncStorage, ToastAndroid, } from 'react-native';
import { WingBlank, DatePicker, List, Tag, WhiteSpace, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera, } from '@wis_component/form';   // form 
import { WisTable, } from '@wis_component/ul';   // ul 

import WISHttpUtils from '@wis_component/http'; 
import {getNowDate,getNowTime} from '../../utils/date';

// 巡库问题项 1
class PageForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      equnr:'设备号',
      matnr:'产品代码',
      maktx:'产品描述',
      zcolo:'颜色',
      zztyp:'平台',
      zvand:'承运商编号',
      zvandn:'承运商名称',
    };
  }

  static propTypes = {
    form: formShape,
  };
  componentDidMount(){
    this.getData();
  }
  async getData(){
    let that=this;
    let routeParams = that.props.route.params.routeParams;
    let params={
    werks: await AsyncStorage.getItem("werks"),
    lgort: await AsyncStorage.getItem("lgort"),
    equnr:routeParams.EQUNR, //从路由取值
    };

    WISHttpUtils.post("app/mentionCar/getWaitingVehicleInformation",params, (result) => {
      let data=result.data;
      if(data){
        that.setState({
          equnr:data.EQUNR,
          matnr:data.MATNR,
          maktx:data.MAKTX,
          zcolo:data.ZCOLO,
          zztyp:data.ZZTYP,
          zvand:data.ZVAND,
          zvandn:data.ZVANDN,
        });
      }else{
        ToastAndroid.show('error',ToastAndroid.SHORT);          
      }
    });
  }
  /**
   * 提交
   * @param
   */
  submit = async() => {
    let that = this;
    let routeParams = that.props.route.params.routeParams;
    let werks = await AsyncStorage.getItem("werks");
    let lgort = await AsyncStorage.getItem("lgort");
    that.props.form.validateFields((error, value) => {
        // 表单 不完整
        if(error){
          Toast.fail('必填字段未填!');
        } else{
          // 保存数据
          value.werks=werks;
          value.lgort=lgort;
          value.zccode='T';
          WISHttpUtils.post("app/mentionCar/updateMentionCarStatus",value, (result) => {
            if(result.data){
              const {navigation} = that.props;
              navigation.navigate('Vehicle2',{ZPART:routeParams.ZPART}) 
            }else{
              ToastAndroid.show("error",ToastAndroid.SHORT);          
            }
          });
        }
    });
  }



  render() {
    const {navigation} = this.props;
    const {equnr, matnr, maktx, zcolo, zztyp, zvand, zvandn}=this.state;
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
                {...getFieldProps('zcolo',{
                rules:[{required:false }],
                initialValue:zcolo
                })} 
                error={getFieldError('zcolo')}               
                lableName="颜色"
                disabled
            />

            <WisInput  
                {...getFieldProps('zztyp',{
                rules:[{required:false }],
                initialValue:zztyp
                })} 
                error={getFieldError('zztyp')}               
                lableName="平台"
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
                lableName="承运商"
                disabled
            />
        </List>
      

        <View style={{height:60,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16}}>
          <Button type="ghost" onPress={this.submit}>提车确认</Button>
        </View>
      
      </ScrollView>
    );
  }
}



export default createForm()(PageForm);

