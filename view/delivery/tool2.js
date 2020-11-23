import React, { Component } from 'react';
import { StyleSheet, ScrollView, View,  AsyncStorage, ToastAndroid,  } from 'react-native';
import { WingBlank, DatePicker, List, Tag, WhiteSpace, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisSearchHead, } from '@wis_component/form';   // form 
import { WisTable, } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 
import {getNowDate,getNowTime,getDate} from '../../utils/date';

// 工具发放出库 2
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      currentPage:1,
      totalPage:20, 
      zvand:''  ,
      date:'',
      columns:{
        ZNO:'序号',
        EQUNR:'设备号',
        ZWADAT:'计划发运日期',
        ZWA_IST:'实际货物移动日期',
        KUNNR:'收货方',
        NAME_ORG1:'收货方名称',
      },
      dataList:[]
    }
  }

  componentDidMount(){
  
    this.getData(   );
  }
  async getData( ){
    let routeParams = this.props.route.params.routeParams;
    let that=this;
   
    let params={
    werks: await AsyncStorage.getItem("werks"),
    lgort: await AsyncStorage.getItem("lgort"),
    zvand:routeParams.ZVAND,
    zsdate:routeParams.date};

    WISHttpUtils.post("app/delivery/getDifferenceBetweenPlanAndActual",params, (result) => {
      let data=result.data;
      if(data&&data[0].STATUS==='S'){
        that.setState({
          zvand:routeParams.ZVAND,
          date:routeParams.date,
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
    let {currentPage,totalPage,zvand,date} = this.state;
    let {navigation} = this.props;

    return (
        <ScrollView style={{paddingTop:0,backgroundColor:"white"}}>

            <View>
 
                <WisInput 
                    lableName="日期"
                    defaultValue={date}
                    disabled  
                />
                <WisInput 
                    lableName="承运商"
                    defaultValue={zvand}
                    disabled  
                />

            </View>

            <WisTable 
              ref="tableRef"
              
              currentPage={currentPage}   // 当前页
              totalPage={totalPage}       // 总页数
              columns={this.state.columns} // columns 配置列
              data={this.state.dataList}  // table 数据
              onChangePage={(option)=>this.onChangePageHandle(option)}   // 页码切换
            />


        </ScrollView>
    );
  }
}



export default PageForm;

