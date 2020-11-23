import React, { Component } from 'react';
import { StyleSheet, ScrollView, View,  AsyncStorage, ToastAndroid,  } from 'react-native';
import { WingBlank, DatePicker, List, Tag, WhiteSpace, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisSearchHead, } from '@wis_component/form';   // form 
import { WisTable, } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 
import {getNowDate,getNowTime,getDate} from '../../utils/date';
// 工具发放出库 1
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      currentPage:1,
      totalPage:20, 
      date:'',  
      columns:{
        ZVAND:'承运商编号',
        ZVANDN:'承运商名称',
        ZPLNUM:'计划发运数',
        ZNUM:'实际发运数',
      },
      dataList:[]
    }
  }


  componentDidMount(){
    this.getData(  getNowDate() );
  }
  async getData(date){
    let that=this;
    let params={
    werks: await AsyncStorage.getItem("werks"),
    lgort: await AsyncStorage.getItem("lgort"),
    zsdate:date};

    WISHttpUtils.post("app/delivery/getCarrierShippingInformation",params, (result) => {
      let data=result.data;
      if(data&&data[0].STATUS==='S'){
        that.setState({
          date:date,
          dataList:data
        });
        this.refs.tableRef.updateTable()
      }else{
        ToastAndroid.show(data[0].MESSAGE,ToastAndroid.SHORT);          
      }
    });
  }

  async onClick(row){
    const {navigation} = this.props;
    if(row.ZPLNUM!==row.ZNUM){
      row.date=this.state.date,
      navigation.navigate('Tool2',row) 
     }
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
    let {currentPage,totalPage} = this.state;
    let {navigation} = this.props;

    return (
        <ScrollView style={{paddingTop:0,backgroundColor:"white"}}>

            <View>
                <WisDatePicker
                    lableName="日期"
                    defaultValue={new Date()}
                    onChangeValue={(value)=>{
                        // 返回日期对象
                        this.getData(getDate(value))
                    }}
                />
            </View>

            <WisTable 
              ref="tableRef"
              titleKey="company"
              currentPage={currentPage}   // 当前页
              totalPage={totalPage}       // 总页数
              columns={this.state.columns} // columns 配置列
              data={this.state.dataList}  // table 数据
              // onChangePage={(option)=>this.onChangePageHandle(option)}   // 页码切换
              onClickRow={(row)=>{
                 this.onClick(row)
              }}
            />

            <WingBlank >
            <View style={{height:60,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16}}>
              <Button type="ghost" onPress={() => navigation.navigate('Tool3') }>扫码</Button>
            </View>
            </WingBlank>
        </ScrollView>
    );
  }
}



export default PageForm;

