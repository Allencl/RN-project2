import React, { Component } from 'react';
import { AsyncStorage, ScrollView, ToastAndroid, View, Text } from 'react-native';
import { WingBlank, WhiteSpace, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisTextarea,WisSearchHead, } from '@wis_component/form';   // form 
import { WisTable, } from '@wis_component/ul';   // ul 
import WISHttpUtils from '@wis_component/http'; 
import {getNowDate,getNowTime} from '../../utils/date'; 
//  电池状态维护 1
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      currentPage:1,
      totalPage:20,   
      columns:{
        "ZNO":"序号",
        "ZPART": "区域编码",
      },
      dataList:[]
    }
  }
  componentDidMount(){
    this.getData();
  }
  async getData(){
    let that=this;
    let params={
    werks: await AsyncStorage.getItem("werks"),
    lgort: await AsyncStorage.getItem("lgort"),
    zwtype: "3", //电池维护
    zsdate:getNowDate()
  };
    WISHttpUtils.post("app/patrolStorehouse/warehouseArea",params, (result) => {
      let data=result.data;
      if(data){
        that.setState({
          dataList:data
        });
        this.refs.tableRef.updateTable()
      }else{
        ToastAndroid.show("error",ToastAndroid.SHORT);          
      }
    });
  }

  async onClick(row){
    const {navigation} = this.props;
    navigation.navigate('Status2',row) 
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

            <WisTable 
              ref="tableRef"
              single={false}        // 是否 单选
              
              currentPage={1}   // 当前页
              totalPage={1}       // 总页数
              columns={this.state.columns} // columns 配置列
              data={this.state.dataList}  // table 数据
              onClickRow={(row)=>{
                this.onClick(row)
              }}
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

