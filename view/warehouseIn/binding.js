import React, { Component } from 'react';
import { AsyncStorage, ScrollView, View,ToastAndroid } from 'react-native';
import { List, Icon, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisTextarea,WisFormHead,WisCamera } from '@wis_component/form';   // form 
import WISHttpUtils from '@wis_component/http'; 

class WarehouseInBindingForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      equnr:'',
      matnr:'',
      zbin:'',
      target:""    
    };
  }

  static propTypes = {
    form: formShape,
  };


  componentDidMount(){
  
  }
  async getData(equnr){
    let that=this;
    let params={
    werks: await AsyncStorage.getItem("werks"),
    lgort: await AsyncStorage.getItem("lgort"),
    equnr: equnr,
    };
    WISHttpUtils.post("app/positionBinding/getVehiclePositionInformation",params, (result) => {
      let data=result.data;
      if(data.STATUS==="S"){
        that.props.form.setFieldsValue({
          equnr:data.EQUNR,
          matnr:data.MATNR,
          zbin:data.ZBIN,
        });
        
      }else{
        if(!result.success){
          ToastAndroid.show(result.message+"",ToastAndroid.SHORT);  
        }else{
          ToastAndroid.show(result.data.MESSAGE+"",ToastAndroid.SHORT);  
        }      
      }
    });
  }

  /**
   * 提交
   * @param
   */
  submit = async() => {
    let that=this;
    let werks = await AsyncStorage.getItem("werks");
    let lgort = await AsyncStorage.getItem("lgort");
    that.props.form.validateFields((error, value) => {
        // 表单 不完整
        if(error){
          Toast.fail('必填字段未填!');
        } else{
          // 保存数据
          value.zbin=that.state.target;
          value.equnr=that.state.equnr;
          value.lgort=lgort;
          value.werks=werks;
          WISHttpUtils.post("app/positionBinding/vehiclePositionBinding",value, (result) => {
            let data=result.data;
            if(result.success&&result.data.STATUS==="S"){
              that.setState({
                equnr:'',
                matnr:'',
                zbin:'',
                target:"",
              })
              that.props.form.resetFields();
            }else{
              if(!result.success){
                ToastAndroid.show(result.message+"",ToastAndroid.SHORT);  
              }else{
                ToastAndroid.show(result.data.MESSAGE+"",ToastAndroid.SHORT);  
              }      
            }
          });
        }
    });
  }



  render() {
    const {navigation} = this.props;
    const {equnr,matnr,zbin,target}=this.state;

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
                    let equnr =this.state.equnr;
                    equnr=data.data
                    this.setState({equnr})
                    this.getData(data.data)
                  }}
          />

          <WisInput  
            {...getFieldProps('zbin',{
              rules:[{required:false }],
              initialValue:zbin
            })} 
            error={getFieldError('zbin')}               
            lableName="源仓位"
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

          <WisCamera      
                  lableName="目标仓位"
                  defaultValue={target}
                  onChangeValue={(data)=>{
                    let target =this.state.target;
                    target=data.data
                    this.setState({target})
                  }}
          />

        </List>
      
      

        <View style={{height:60,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16}}>
          <Button type="ghost" onPress={this.submit}>确认</Button>
        </View>
      
      </ScrollView>
    );
  }
}



export default createForm()(WarehouseInBindingForm);

