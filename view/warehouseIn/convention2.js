import React, { Component } from 'react';
import { AsyncStorage, ScrollView, View ,ToastAndroid} from 'react-native';
import { List, Icon, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisRadio, WisInput,WisTextarea,WisFormHead,WisCamera } from '@wis_component/form';   // form 
import WISHttpUtils from '@wis_component/http'; 
import {getNowDate,getNowTime} from '../../utils/date'; 
// 日常 巡库2
class PageForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      equnr:'',
      matnr:'产品代码',
      zbin:'仓位',
      zestuta:1,//电池状态 1：已安装 2：已拆卸
      zestext:'取表里的电池状态',
      zresult:'巡库结果',
      zqtext:'例如电池状态不正确'
    };
  }

  static propTypes = {
    form: formShape,
  };
  componentDidMount(){
    //this.getData();
  }

  async getData(equnr){
    let that=this;
    let routeParams = this.props.route.params.routeParams;
    let params={
    werks: await AsyncStorage.getItem("werks"),
    lgort: await AsyncStorage.getItem("lgort"),
    zwtype: "1",
    zsdate:getNowDate(),
    equnr:equnr,//扫描获得
    ztno:routeParams.ZTNO,//上个页面传入参数
    zpart:routeParams.ZPART//上个页面传入参数
    };

    WISHttpUtils.post("app/patrolStorehouse/getVehiclePatrolInformation",params, (result) => {
      let data=result.data;
      if(result.data.STATUS==="S"){
        that.props.form.setFieldsValue({
          equnr:data.EQUNR,
          zestext:data.ZESTEXT,
          zbin:data.ZBIN,
          zestuta:data.ZESTUTA,
          matnr:data.MATNR,
        });
      }else{
          ToastAndroid.show(result.data.MESSAGE,ToastAndroid.SHORT);  
        }     
    });
  }



  /**
   * 提交
   * @param
   */
   submit=async()=>{
    let that=this;
    let routeParams = this.props.route.params.routeParams;
    let werks = await AsyncStorage.getItem("werks");
    let lgort = await AsyncStorage.getItem("lgort");
    let zqstat = await AsyncStorage.getItem("userName");
    const {navigation} = this.props;
    that.props.form.validateFields((error, value) => {
        // 表单 不完整
        if(error){
          Toast.fail('必填字段未填!');
        } else{

          // 保存数据
          value.werks= werks
          value.lgort= lgort
          value.zqstat= zqstat
          value.ztno=routeParams.ZTNO;//上个页面传入参数
          value.zpart=routeParams.ZPART;//上个页面传入参数
          value.zresult=2;
          value.zcmdate=getNowDate();
          value.zcmtime=getNowTime();
          WISHttpUtils.post("app/patrolStorehouse/updateVehiclePatrolInformation",value, (result) => {
            let data=result.data;
            if(result.data.STATUS==="S"){
              navigation.navigate('Convention') 
            }else{
                ToastAndroid.show(result.data.MESSAGE,ToastAndroid.SHORT);  
              }      

          });
        }
    });
  }



  render() {
    const {navigation} = this.props;
    const {equnr,matnr,zbin,zestext,zestuta,zresult,zqtext}=this.state;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    return (
      <ScrollView style={{flex:1,backgroundColor:"white"}}>

        <List 
          style={{paddingBottom:50}}
          renderHeader={<WisFormHead/>} 
        >
          <View>
                <WisCamera      
                  lableName="VIN码"
                  onChangeValue={(data)=>{
                    this.getData(data.data)
                  }}
                />
          </View>

 


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
            {...getFieldProps('zbin',{
              rules:[{required:false }],
              initialValue:zbin
            })} 
            error={getFieldError('zbin')}               
            lableName="仓位"
            disabled
          />

          <WisInput  
            {...getFieldProps('zestext',{
              rules:[{required:false }],
              initialValue:zestext
            })} 
            error={getFieldError('zestext')}               
            lableName="电池状态"
            disabled
          />


          <WisRadio  
            lableName="巡库结果"
            defaultValue={1}
            children={[
              {id:1,lable:"正常"},
              {id:2,lable:"存在问题"}
            ]}             
            onChangeValue={(ID)=>{
            }}
          />


          <WisTextarea 
            {...getFieldProps('zqtext',{
                rules:[{required:true }],
                initialValue:zqtext
            })} 
            error={getFieldError('zqtext')}         
            lableName="问题描述"
          />
        </List>
      
      

        <View style={{height:60,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16}}>
          <Button type="ghost" onPress={this.submit}>提交</Button>
        </View>
      
      </ScrollView>
    );
  }
}



export default createForm()(PageForm);

