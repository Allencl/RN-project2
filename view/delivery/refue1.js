import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, AsyncStorage, ToastAndroid, } from 'react-native';
import { WingBlank, DatePicker, List, Tag, WhiteSpace, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera, } from '@wis_component/form';   // form 
import { WisTable } from '@wis_component/ul';   // ul 

import WISHttpUtils from '@wis_component/http'; 
import {getNowDate,getNowTime} from '../../utils/date';

// 加油加气 1 
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      currentPage:1,
      totalPage:20,   
      columns:{
        company:"承运商",
        date:"台数",
        date2:"加油量",
        date3:"尿素量",
        date4:"天然气"
      },
      dataList:[
        {
            company:"承运商111",
            date:"台数11",
            date2:"加油量1",
            date3:"尿素量1",
            date4:"天然气111"
        },
         
      ]
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
  
  async VINChangeValue(data){
    let that=this;
    let params={
    werks: await AsyncStorage.getItem("werks"),
    lgort: await AsyncStorage.getItem("lgort"),
    equnr:data
   };

 
  WISHttpUtils.post("app/refuelsAndAerated/getVehicleRefuelsAndAerated",params, (result) => {
    let data=result.data;
    if(data){
      let {navigation} = that.props;
      if(data.ZTYPE.indexOf('油')!==-1){
        navigation.navigate('Refue3',data)
      }else{
        navigation.navigate('Refue2',data)
      }
    }else{
      ToastAndroid.show("error",ToastAndroid.SHORT);          
    }
  });
  }
 

  render() {
    let {currentPage,totalPage} = this.state;
    let {navigation} = this.props;

    return (
        <ScrollView style={{paddingTop:0,backgroundColor:"white"}}>

            <View>
                <WisCamera      
                  lableName="VIN码"
                  onChangeValue={(data)=>{
                    this.VINChangeValue(data.data)
                  }}
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

            <WingBlank >
            <View style={{height:60,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16}}>
             
            </View>
            </WingBlank>
        </ScrollView>
    );
  }
}



export default PageForm;

