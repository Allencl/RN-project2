import React, { Component } from 'react';
import { StyleSheet, ScrollView, View,  AsyncStorage, ToastAndroid,  } from 'react-native';
import { WingBlank, DatePicker, List, Tag, WhiteSpace, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera, } from '@wis_component/form';   // form 
import { WisTable, } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 
import {getNowDate,getNowTime,getDate} from '../../utils/date';

// 工具发放出库 3
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      currentPage:1,
      totalPage:20,   
      columns:{
        ZNO:'序号',
        EQUNR:'设备号',
        MATNR:'物料编号',
        MAKTX:'物料描述',
        MENGE:'需求数量',
      },
      equnr:'设备号',
      maktx:'物料描述',
      zcode:'检验结果',
      zvand:'承运商编号',
      zvandn:'承运商名称',
      zrnum:'燃料加注',
      znnum:'尿素加注',
      testText:'检验结果',
      dataList:[],
      btnFlag:true,
      testTextList:["未产生检验批","检验未完成","不合格","合格"]
    }
  }


  componentDidMount(){
   // this.getData( 'LG6ZNDNH3LX092003');
  }
  async getData(equnr){
    let that=this;
 
    let params={
    werks: await AsyncStorage.getItem("werks"),
    lgort: await AsyncStorage.getItem("lgort"),
    equnr:equnr,
    };
 
    WISHttpUtils.post("app/delivery/getVehicleDeliveryInfo",params, (result) => {
      let header=result.data.RETURN_HEADER;
      let data=result.data.ITEM;
 
      if(header.STATUS==="S"){
        let testText = that.state.testTextList[header.ZCODE-1]
        let btnFlag = true;
        if(header.ZCODE===4){btnFlag=false}
        that.setState({
          dataList:data,
          btnFlag:btnFlag,
          equnr:header.EQUNR,
          maktx:header.MAKTX,
          zcode:header.ZCODE,
          testText:testText,
          zvand:header.ZVAND,
          zvandn:header.ZVANDN,
          zrnum:header.ZRNUM,
          znnum:header.ZNNUM,
        });
        that.refs.tableRef.updateTable();
      }else{
        ToastAndroid.show(header.MESSAGE,ToastAndroid.SHORT);          
      }
    });
  }

  async confirm(){
    let that=this;
    let data=that.state;
    let params={
    werks: await AsyncStorage.getItem("werks"),
    lgort: await AsyncStorage.getItem("lgort"),
    equnr:data.equnr,
    zobdq:'',
    zdate:getNowDate(),
    };
    WISHttpUtils.post("app/delivery/confirmVehicleDelivery",params, (result) => {
      let data=result.data;
      if(data.STATUS==="S"){
        ToastAndroid.show(data.MESSAGE,ToastAndroid.SHORT);  
        that.setState({
          dataList:[],
          btnFlag:true,
          equnr:'',
          maktx:'',
          zcode:'',
          testText:'',
          zvand:'',
          zvandn:'',
          zrnum:'',
          znnum:'',
        });
        that.refs.tableRef.updateTable();
      }else{
        ToastAndroid.show(data.MESSAGE,ToastAndroid.SHORT);          
      }
    });
  }
  abnormal(){
    const {navigation} = this.props;
    navigation.navigate('Tool4',this.state) 
  }
  /**
   * 
   * @param {} option 
   */
  getSelectDataHandle(){
    let selectData=this.refs.tableRef.getSelectData();  // 选中数据
  }


  /**
   * 
   * @param {action,page} option {状态，切换页码}
   */
  onChangePageHandle(option){
    this.setState({
      currentPage: option["targetPage"],
      totalPage:20,   
      dataList:[{
        company: '上海科技股份有限公司',
        date:"2010年11月22日"+new Date().getTime()
      }]
    },()=>{
      this.refs.tableRef.updateTable();
    });


    

  }


  render() {
    let {currentPage,totalPage, equnr,maktx,zcode,testText,zvand,zvandn,zrnum,znnum,btnFlag} = this.state;
    let {navigation} = this.props;

    return (
        <ScrollView style={{paddingTop:0,backgroundColor:"white"}}>

            <View>

                <WisCamera      
                  lableName="VIN码"
                  placeholder={equnr}
                  onChangeValue={(data)=>{
                    this.getData(data.data)
                  }}
                />              

                <WisInput 
                    lableName="产品描述"
                    placeholder={maktx}
                    disabled
                />

                <WisInput 
                    lableName="检验结果"
                    placeholder={testText}
                    disabled
                />

                <WisInput 
                    lableName="承运商"
                    placeholder={zvandn}
                    disabled
                />   

                <WisInput 
                    lableName="燃料加注"
                    placeholder={zrnum}
                    disabled
                />                 

                <WisInput 
                    lableName="尿素加注"
                    placeholder={znnum}
                    disabled
                /> 
            </View>

            <WisTable 
              ref="tableRef"
              checkBox={false}
              currentPage={currentPage}   // 当前页
              totalPage={totalPage}       // 总页数
              columns={this.state.columns} // columns 配置列
              data={this.state.dataList}  // table 数据
            />

            <WingBlank >
              <View style={{height:60,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16}}>
                <Button type="ghost" disabled={this.state.btnFlag} onPress={() =>  this.confirm() }>出库确认</Button>
                <Button type="ghost" disabled={this.state.btnFlag} onPress={()=> this.abnormal()}>车辆异常</Button>
              </View>
            </WingBlank>

        </ScrollView>
    );
  }
}



export default PageForm;

