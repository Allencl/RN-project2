import React, { Component } from 'react';
import { AsyncStorage,ToastAndroid, ScrollView, View } from 'react-native';
import { List, Icon, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisRadio, WisInput,WisTextarea,WisFormHead, } from '@wis_component/form';   // form 
import WISHttpUtils from '@wis_component/http'; 
import {getNowDate,getNowTime} from '../../utils/date'; 

// 巡库问题项 1
class PageForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      equnr:'',
      matnr:'产品代码',
      zbin:'仓位',
      ztno:'巡库问题号',
      zestuta:'取表里的电池状态',
      zestext:'取表里的电池状态',
      zresult:'巡库结果',
      zqtext:'',
      result:true,
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
    let routeParams = this.props.route.params.routeParams;
    let params={
    werks: await AsyncStorage.getItem("werks"),
    lgort: await AsyncStorage.getItem("lgort"),
    equnr:routeParams.EQUNR,//扫描获得
    zpart:routeParams.ZPART//上个页面传入参数
    };

    WISHttpUtils.post("app/patrolStorehouse/getVehiclePatrolProblem",params, (result) => {
      let data=result.data;
      if(result.data.STATUS==="S"){
        if(data.ZRESULT===0){
          that.setState({
            result:false
          });
        }
        that.props.form.setFieldsValue({
          equnr:data.EQUNR,
          zestext:data.ZESTEXT,
          zbin:data.ZBIN,
          ztno:data.ZTNO,
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
  async submit (zactcode){
    const {navigation} = this.props;
    let werks = await AsyncStorage.getItem("werks");
    let lgort = await AsyncStorage.getItem("lgort");
    this.props.form.validateFields((error, value) => {
        // 表单 不完整
        if(error){
          Toast.fail('必填字段未填!');
        } else{
          // 保存数据
        value.werks= werks
        value.lgort= lgort
        value.zresult=2;
        value.zactcod=zactcode
        WISHttpUtils.post("app/patrolStorehouse/updateVehiclePatrolProblem",value, (result) => {
            let data=result.data;
            if(result.data.STATUS==="S"){
              navigation.navigate('Issue') 
            }else{
                ToastAndroid.show(result.data.MESSAGE,ToastAndroid.SHORT);  
              }     
          });
        }
    });
  }



  render() {
    const {navigation} = this.props;
    const {equnr,matnr,zbin,zestext,zestuta,zresult,zqtext,result,ztno}=this.state;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    return (
      <ScrollView style={{flex:1,backgroundColor:"white"}}>

        <List 
          style={{paddingBottom:50}}
          renderHeader={<WisFormHead/>} 
        >


          <WisInput 
            {...getFieldProps('equnr',{
                rules:[{required:true }],
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
            {...getFieldProps('ztno',{
              rules:[{required:false }],
              initialValue:ztno
            })} 
            error={getFieldError('ztno')}               
            lableName="巡库任务号"
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
            onChange={(ID)=>{
            }}
            disabled={result}
          />


          <WisTextarea 
            {...getFieldProps('zqtext',{
                rules:[{required:true }],
                initialValue:zqtext
            })} 
            error={getFieldError('zqtext')}         
            lableName="问题描述"
            disabled={result}
          />
        </List>
      
      

        <View style={{height:60,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16}}>
        <Button type="ghost" onPress={()=> this.submit("2")} disabled={!result}>已修复</Button>
        <Button type="ghost" onPress={()=> this.submit("1")} disabled={result}>提交</Button>
        </View>
      
      </ScrollView>
    );
  }
}



export default createForm()(PageForm);

