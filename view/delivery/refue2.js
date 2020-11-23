import React, { Component } from 'react';
import { AsyncStorage, ToastAndroid, ScrollView, View } from 'react-native';
import { List, Icon, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisCamera, WisRadio, WisInput,WisTextarea,WisFormHead, } from '@wis_component/form';   // form 
 

import WISHttpUtils from '@wis_component/http'; 
// 加油加气 2
class PageForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      equnr:'设备号',
      maktx:'产品描述',
      ztype:'燃油类型',
      zvand:'承运商编号',
      zvandn:'承运商名称',
      zynum:'加油量',
      zqnum:'加气量',
      znnum:'加尿素量',
      zqnum1:'',
      zynum1:'',
      znnum1:'',
    };
  }

  static propTypes = {
    form: formShape,
  };


  componentDidMount(){
    this.getData();
  }

  async getData(){
    let routeParams = this.props.route.params.routeParams;
    let that=this;
    that.setState({
      equnr:routeParams.EQUNR,
      maktx:routeParams.MAKTX,
      ztype:routeParams.ZTYPE,
      zvand:routeParams.ZVAND,
      zvandn:routeParams.ZVANDN,
      zynum:routeParams.ZYNUM,
      zqnum:routeParams.ZQNUM,
      znnum:routeParams.ZNNUM
    });
  }

  /**
   * 提交
   * @param
   */
  async submit(type)  {
    let that=this;
    let routeParams = this.props.route.params.routeParams;
    let werks = await AsyncStorage.getItem("werks");
    let lgort = await AsyncStorage.getItem("lgort");
    that.props.form.validateFields((error, value) => {
        // 表单 不完整
        if(error){
          Toast.fail('必填字段未填!');
        } else{
          if(!value.zynum1){
            value.zynum1=routeParams.zynum
          }
          if(!value.znnum1){
            value.znnum1=routeParams.znnum
          }
          value.werks=werks;
          value.lgort=lgort;
          value.zactvt=type;
          value.zvand=routeParams.ZVAND;
          // 保存数据
          WISHttpUtils.post("app/refuelsAndAerated/updateVehicleRefuelsAndAerated",value, (result) => {
            let data=result.data;
            if(data.STATUS==="S"){
              let {navigation} = that.props;
              navigation.navigate('Refue1');
            }else{
              ToastAndroid.show(data.MESSAGE,ToastAndroid.SHORT);          
            }
          });
        }
    });
  }



  render() {
    const {navigation} = this.props;
    const { equnr,maktx,ztype, zvand,zvandn,zynum,zynum1,zqnum,znnum,znnum1,zqnum1}=this.state;
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
          <WisInput  
            {...getFieldProps('zqnum1',{
              rules:[{required:true }],
              initialValue:zqnum1
            })} 
            error={getFieldError('zqnum1')}               
            lableName="加油量"
            extra={"需加油量"+zqnum}
          />
      
        </List>
        <View style={{height:60,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16}}>
        <Button type="ghost" onPress={() =>this.submit("1")}>确认</Button>
        </View>
      </ScrollView>
    );
  }
}



export default createForm()(PageForm);

