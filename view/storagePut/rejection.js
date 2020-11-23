import React, { Component } from 'react';
import { AsyncStorage, ScrollView, View ,ToastAndroid} from 'react-native';
import { List, Icon, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisTextarea,WisFormHead, } from '@wis_component/form';   // form 
import {getNowDate,getNowTime} from '../../utils/date'; 
import WISHttpUtils from '@wis_component/http';
class RejectionForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      zmeid:'D00000090301',
      equnr:'LG6ZDBNH2LX012806',
      matnr:'X4250D5WACPF33B003-ZH',
      aufnr:'800000000714',
      werks: "1031",
      lgort: "3005",
      zrefdat:'20200904',
      zreftext:'',
    };
  }

  static propTypes = {
    form: formShape,
  };
  componentDidMount(){
  }
  /**
   * 提交
   * @param
   */
  submit = async() => {
    let werks = await AsyncStorage.getItem("werks");
    let lgort = await AsyncStorage.getItem("lgort");
    let routeParams = this.props.route.params.routeParams.data;
    this.props.form.validateFields((error, value) => {
        // 表单 不完整
        if(error){
          Toast.fail('必填字段未填!');
        } else{
          const {navigation} = this.props;
          let params=this.state;
          value.lgort=lgort;
          value.werks=werks;
          value.zmeid=routeParams.zmeid,
          value.equnr=routeParams.equnr,
          value.matnr=routeParams.matnr,
          value.aufnr=routeParams.aufnr,
          value.zrefdat=getNowDate()
          WISHttpUtils.post("/app/enteringWarehouse/vehicleRefused",value, (result) => {
            let data =result.data
            if(data.STATUS==="S"){
              navigation.navigate('StoragePut')
            }else{
              ToastAndroid.show("error",ToastAndroid.SHORT);
            }
          });
        }
    });
  }



  render() {
    const {navigation} = this.props;
    const {zreftext}=this.state;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    // 收到的参数
     
    return (
      <ScrollView style={{flex:1,backgroundColor:"white"}}>

        <List 
          style={{paddingBottom:50}}
          renderHeader={<WisFormHead/>} 
        >

          <WisTextarea 
            {...getFieldProps('zreftext',{
                rules:[{required:true }],
                initialValue:zreftext
            })} 
            error={getFieldError('zreftext')}         
            lableName="拒收原因"
          />
        </List>
      
        <View style={{height:60,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16}}>
          <Button type="primary" onPress={this.submit}>确认</Button>
        </View>
      
      </ScrollView>
    );
  }
}



export default createForm()(RejectionForm);

