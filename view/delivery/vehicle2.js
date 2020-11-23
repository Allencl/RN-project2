import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, AsyncStorage, ToastAndroid, } from 'react-native';
import { WingBlank, DatePicker, List, Tag, WhiteSpace, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisSearchHead,WisCamera } from '@wis_component/form';   // form 
import { WisTable, } from '@wis_component/ul';   // ul 

import WISHttpUtils from '@wis_component/http'; 
import {getNowDate,getNowTime} from '../../utils/date';

// 库内盘点 2
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      currentPage:1,
      totalPage:20,
      date:'',
      columns:{
        ZNO:'序号',
        EQUNR:'设备号',
        ZBIN:'仓位编号',
        ZESTUTA:'电池状态',
        ZVAND:'承运商',
        ZVANDN:'承运商名称'
      },
      dataList:[]
    }
  }

  componentDidMount(){
    let routeParams = this.props.route.params.routeParams;
    this.setState({
      date:new Date(routeParams.date.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"))
    })
    this.getData(routeParams.date)
  }

  async getData(date){
    let routeParams = this.props.route.params.routeParams;
    let that=this;
    let params={
    werks: await AsyncStorage.getItem("werks"),
    lgort: await AsyncStorage.getItem("lgort"),
    zpdate:date,
    zpart:routeParams.ZPART };
    WISHttpUtils.post("app/mentionCar/getRegionalWaitingVehicles",params, (result) => {
      let data=result.data;
      if(data&&data[0].STATUS==="S"){
        that.setState({
          dataList:result.data
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

  async onClick(row){
    // if(!row.ZTNO){
    //   return;
    // }
    const {navigation} = this.props;
    navigation.navigate('Vehicle3',row) 
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
      navigation.push('Vehicle3',params) 
    }else{
      ToastAndroid.show("VIN码不在列表中",ToastAndroid.SHORT);          
    }
  }

  render() {
    let {currentPage,totalPage,date} = this.state;
    let {navigation} = this.props;

    return (
        <ScrollView style={{paddingTop:0,backgroundColor:"white"}}>

            <View>
          
                <WisFormHead 
                    icon="tag" 
                    title={`区域：${"西一区"}`}
                />
        
                <WisDatePicker
                  lableName="计划日期"
                  defaultValue={date}
                  disabled
                  // onChangeValue={(value)=>{
                  //     // 返回日期对象
                  //     this.getData(  value );
                  // }}
                  
                />
                <WisCamera      
                  lableName="VIN码"
                  onChangeValue={(data)=>{
                    this.onChange(data.data)
                  }}
                />


            </View>

            <WisTable 
              ref="tableRef"
              checkBox={false}
              single={false}        // 是否 单选
              onClickRow={(row)=>{
              //  this.onClick(row)
              }}
              currentPage={currentPage}   // 当前页
              totalPage={totalPage}       // 总页数
              columns={this.state.columns} // columns 配置列
              data={this.state.dataList}  // table 数据
              onChangePage={(option)=>this.onChangePageHandle(option)}   // 页码切换
            />

            <WingBlank >
            <View style={{height:60,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16}}>
 
            </View>
            </WingBlank>
        </ScrollView>
    );
  }
}



export default PageForm;

