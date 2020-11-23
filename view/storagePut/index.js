import React, { Component } from 'react';
import { AsyncStorage, ScrollView, View,   ToastAndroid, } from 'react-native';
import { List, Icon, Toast, Button } from '@ant-design/react-native';
import { createForm, formShape } from 'rc-form';
import { WisInput,WisTextarea,WisFormHead,WisCamera } from '@wis_component/form';   // form 
import WISHttpUtils from '@wis_component/http';   // http 
class StoragePutPageForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      zmeid:'',
      equnr:'',
      kunnr:'',
      aufnr:'',
      matnr:'',
      ztext:'',
      lgort:'',
      werks:'',
      zreftext:'',
      zrefdat:'',
      submitFlag:true
    };
  }

  static propTypes = {
    form: formShape,
  };

  componentDidMount(){
    this.getData();
  }


  /**
   * 获取入库单信息
   */
  getData(_zmeid,_equnr){
    let that=this;
    if(_zmeid){
      let zmeid= this.state.zmeid;
      zmeid=_zmeid;
      this.setState({zmeid});
    }else{
      _zmeid=this.state.zmeid;
    }
    if(_equnr){
      let equnr= this.state.equnr;
      equnr=_equnr;
      this.setState({equnr});
    }else{
      _equnr=this.state.equnr;
    }
    if(_zmeid===''||_equnr===''){
      return
    }

    let params={
      zmeid:_zmeid,
      equnr:_equnr, 
    };
    console.log(params)
    WISHttpUtils.post("/app/enteringWarehouse/warehousingEntries",params, (result) => {
      let data=result.data;
      
      if(data.STATUS==="S"){
        that.setState({submitFlag:false});
        that.props.form.setFieldsValue({
          zmeid:params.zmeid,
          equnr:params.equnr,
          kunnr:data.KUNNR,
          zreser2:data.ZRESER2,
          aufnr:data.AUFNR+"",
          matnr:data.MATNR,
          zmtr1:data.ZMTR1,
          zreser1:data.ZRESER1,
          zmtr2:data.ZMTR2,
          ztext:data.ZTEXT,
        });
      }else{
        ToastAndroid.show("error",ToastAndroid.SHORT);          
      }
    });
    
  } 
  /**
   * 提交
   * @param
   */
  submit = () => {
    let that=this;
    that.props.form.validateFields((error, value) => {
        // 表单 不完整
        if(error){
          Toast.fail('必填字段未填!');
        } else{
          // 保存数据 并重置表单
          value.zmeid =that.state.zmeid;
          value.equnr =that.state.equnr;
          WISHttpUtils.post("/app/enteringWarehouse/postWarehouseEntry",value, (result) => {
            let data=result.data;
            if(data.STATUS==="S"){
              that.setState({submitFlag:true});
              that.props.form.resetFields();
            }else{
              ToastAndroid.show("error",ToastAndroid.SHORT);          
            }
            });       
        }
    });
  }



  render() {
    const {navigation} = this.props;
    const { zmeid,equnr,kunnr,zreser2,aufnr,matnr,zmtr1,zreser1,zmtr2,ztext,submitFlag}=this.state;
 
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    
    return (
      <ScrollView style={{flex:1,backgroundColor:"white"}}>

        <List 
          style={{paddingBottom:50}}
          renderHeader={<WisFormHead/>} 
        >

          {/* <WisInput 
            {...getFieldProps('zmeid',{
                rules:[{required:true }],
                initialValue:zmeid
            })} 
            error={getFieldError('zmeid')}         
            lableName="入库单号"
          /> */}
          <WisCamera      
                  lableName="入库单号"
                  defaultValue={zmeid}
                  onChangeValue={(data)=>{
                    this.getData(data.data,null)
                  }}
          />

          <WisCamera      
                  lableName="VIN码"
                  defaultValue={equnr}
                  onChangeValue={(data)=>{

                    this.getData(null,data.data)
                  }}
          />

          {/* <WisInput 
            {...getFieldProps('equnr',{
                rules:[{required:true }],
                initialValue:equnr
            })} 
            error={getFieldError('equnr')}         
            lableName="VIN码"
          /> */}

          <WisInput  
            {...getFieldProps('aufnr',{
              rules:[{required:false }],
              initialValue:aufnr
            })} 
            error={getFieldError('aufnr')}               
            lableName="订单号"
            disabled
          />

          <WisInput  
            {...getFieldProps('kunnr',{
              rules:[{required:false }],
              initialValue:kunnr
            })} 
            error={getFieldError('kunnr')}               
            lableName="经销商"
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
            {...getFieldProps('zreser2',{
              rules:[{required:false }],
              initialValue:zreser2
            })} 
            error={getFieldError('zreser2')}               
            lableName="底盘号"
            disabled
          />

          <WisInput  
            {...getFieldProps('zreser1',{
              rules:[{required:false }],
              initialValue:zreser1
            })} 
            error={getFieldError('zreser1')}               
            lableName="后桥代码"
            disabled
          />    

          <WisInput  
            {...getFieldProps('zmtr1',{
              rules:[{required:false }],
              initialValue:zmtr1
            })} 
            error={getFieldError('zmtr1')}               
            lableName="变速箱代码"
            disabled
          /> 



          <WisInput  
            {...getFieldProps('zmtr2',{
              rules:[{required:false }],
              initialValue:zmtr2
            })} 
            error={getFieldError('zmtr2')}               
            lableName="发动机代码"
            disabled
          />

          <WisTextarea 
            {...getFieldProps('ztext',{
                rules:[{required:true }],
                initialValue:ztext
            })} 
            error={getFieldError('ztext')}         
            lableName="备注"
          />
        </List>

        <View style={{height:60,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16}}>
          <Button disabled={submitFlag} type="ghost" onPress={this.submit}>入库</Button>
          <Button type="primary" onPress={() => navigation.navigate('Binding',{data:this.state}) }>绑定仓位</Button>
          <Button disabled={submitFlag} type="warning" 
            onPress={() => navigation.navigate('Rejection',{data:this.state}) }
          >拒收</Button>
        </View>
      
      </ScrollView>
    );
  }
}



export default createForm()(StoragePutPageForm);

