import React, { Component } from 'react';
import { Dimensions,StyleSheet, ScrollView, View,Text,  AsyncStorage, ToastAndroid,Button   } from 'react-native';
import { WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,  } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 


// 任务
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
        this.refs.tableRef.updateTable();
      }else{
        ToastAndroid.show(data[0].MESSAGE,ToastAndroid.SHORT);          
      }
    });
  }


  render() {
    let {currentPage,totalPage} = this.state;
    let {navigation} = this.props;

    return (
        <View style={{height:Dimensions.get('window').height-131}}>
          <ScrollView style={{paddingTop:0,backgroundColor:"white"}}>

              <WisTable 
                ref="tableRef"                
                currentPage={1}   // 当前页
                totalPage={3}       // 总页数
                columns={this.state.columns} // columns 配置列
                data={this.state.dataList}  // table 数据
                onChangePage={()=>{
                  
                }}
                onRefresh={()=>{
                  console.log("刷新函数回调，重新拉一下数据！")
                }}
              />


          </ScrollView>

          <WisButtonFloat 
            children={[
              {
                text:"按钮1",
                onPress:(option)=>{
                  // let selectData=this.refs.tableRef.getSelectData();  // 选中数据
                  // console.log(option);
                }
              }
            ]}
          />                

        </View>
    );
  }
}



export default PageForm;

