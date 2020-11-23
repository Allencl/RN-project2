import React, { Component } from 'react';
import { StyleSheet, ScrollView, View,  AsyncStorage, ToastAndroid,   } from 'react-native';
import { WingBlank, DatePicker, List, Tag, WhiteSpace, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable, } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 
import {getNowDate,getNowTime,getDate} from '../../utils/date';
// 出厂确认1 
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      currentPage:1,
      totalPage:20,   
      columns:{
        ZNO:'序号',
        EQUNR:'设备号',
        ZCOLO:'颜色',
      },
      dataList:[]
    }
  }
  componentDidMount(){
    this.getData(  '20200923' );
  }
  async getData(date){
    let that=this;
    let params={
    werks: await AsyncStorage.getItem("werks"),
    lgort: await AsyncStorage.getItem("lgort"),
    zsdate:date};
    WISHttpUtils.post("app/delivery/getTheListOfVehiclesToBeReleased",params, (result) => {
      let data=result.data;
      if(data&&data[0].STATUS==='S'){
        that.setState({
          dataList:data
        });
        this.refs.tableRef.updateTable()
      }else{
        ToastAndroid.show(data[0].MESSAGE,ToastAndroid.SHORT);          
      }
    });
  }
  /**
   * 
   * @param {} option 
   */
  getSelectDataHandle(){
    let selectData=this.refs.tableRef.getSelectData();  // 选中数据
  }

  onChange(data){
    const {navigation} = this.props;
    let dataList=this.state.dataList;
    var arr = this.state.dataList.map(function(o) {return o.EQUNR;});
    let i=arr.indexOf(data);
    if(i>-1){
      //跳转 
      let params ={
        EQUNR:data
      }
      navigation.push('Affirm2',params) 
    }else{
      ToastAndroid.show("VIN码不在列表中",ToastAndroid.SHORT);          
    }
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
    let {currentPage,totalPage} = this.state;
    let {navigation} = this.props;

    return (
        <ScrollView style={{paddingTop:0,backgroundColor:"white"}}>

            <View>
                <WisDatePicker
                    lableName="日期"
                    onChangeValue={(value)=>{
                        // 返回日期对象
                        this.getData(getDate(value))
                    }}
                />
                <WisInput 
                    lableName="放行数量"
                    defaultValue={this.state.dataList.length+''}
                    onChangeValue={(value)=>{
                    }}  
                />                
                
            </View>

            <WisTable 
              ref="tableRef"
              
              currentPage={1}   // 当前页
              totalPage={1}       // 总页数
              columns={this.state.columns} // columns 配置列
              data={this.state.dataList}  // table 数据
              onRefresh={()=>{
                console.log("刷新函数回调，重新拉一下数据！")
              }}
            />

            <WingBlank >
            <View>
                <WisCamera      
                  lableName="VIN码"
                  onChangeValue={(data)=>{
                    this.onChange(data.data)
                  }}
                />
            </View>
            <View style={{height:60,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16}}>
            </View>
            </WingBlank>
        </ScrollView>
    );
  }
}



export default PageForm;

