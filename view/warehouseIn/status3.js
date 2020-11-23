import React, { Component } from 'react';
import { AsyncStorage,ToastAndroid, ScrollView, View } from 'react-native';
import { List, Icon, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisRadio, WisInput,WisTextarea,WisFormHead, } from '@wis_component/form';   // form 
import {getNowDate,getNowTime} from '../../utils/date'; 
import WISHttpUtils from '@wis_component/http'; 
//  电池状态维护 3
class PageForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      EQUNR:'VIN码',
      MATNR:'产品代码',
      ZBIN:'仓位',
      ZDAYS:''
    };
  }

  static propTypes = {
    form: formShape,
  };
  componentDidMount(){ 
    let data = this.props.route.params.routeParams;
    this.props.form.setFieldsValue({
      EQUNR:data.EQUNR,
      ZBIN:data.ZBIN,
      ZDAYS:data.ZDAYS,
      MATNR:data.MATNR,
    });
  }
  /**
   * 提交
   * @param
   */
  submit=async()=>{
    let werks = await AsyncStorage.getItem("werks");
    let lgort = await AsyncStorage.getItem("lgort");
    let zupnam = await AsyncStorage.getItem("userName");
    let data = this.props.route.params.routeParams;
    let that=this;
    that.props.form.validateFields((error, value) => {
        // 表单 不完整
        if(error){
          Toast.fail('必填字段未填!');
        } else{
          const {navigation} = that.props;
          // 保存数据
          let params ={
            equnr:data.EQUNR,
            zbin:data.ZBIN,
            zdays:data.ZDAYS,
            zpart:data.ZPART,
            matnr:data.MATNR,
            zendate:getNowDate(),
            zupnam:zupnam,
            lgort:lgort,
            werks:werks,
          }
          WISHttpUtils.post("app/battery/updateBatteryStatus",params, (result) => {
            //返回上一页
            navigation.navigate("Status2",data)
          });
        }
    });
  }



  render() {
    const {navigation} = this.props;
    const {EQUNR,MATNR,ZBIN,status,ZDAYS}=this.state;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    return (
      <ScrollView style={{flex:1,backgroundColor:"white"}}>

        <List 
          style={{paddingBottom:50}}
          renderHeader={<WisFormHead/>} 
        >


            <WisInput 
                {...getFieldProps('EQUNR',{
                    rules:[{required:true }],
                    initialValue:EQUNR
                })} 
                error={getFieldError('EQUNR')}         
                lableName="VIN码"
            />

            <WisInput  
                {...getFieldProps('ZBIN',{
                rules:[{required:false }],
                initialValue:ZBIN
                })} 
                error={getFieldError('ZBIN')}               
                lableName="仓位"
                disabled
            />

            <WisInput  
                {...getFieldProps('MATNR',{
                rules:[{required:false }],
                initialValue:MATNR
                })} 
                error={getFieldError('MATNR')}               
                lableName="产品代码"
                disabled
            />


            <WisInput  
                {...getFieldProps('ZDAYS',{
                rules:[{required:false }],
                initialValue:ZDAYS
                })} 
                error={getFieldError('ZDAYS')}               
                lableName="在库天数"
                extra={"天"}
                disabled
            />


        </List>
      
      

        <View style={{height:60,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16}}>
          <Button type="ghost" onPress={this.submit}>拆卸电池</Button>
        </View>
      
      </ScrollView>
    );
  }
}



export default createForm()(PageForm);

