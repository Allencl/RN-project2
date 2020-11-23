import React, { Component } from 'react';
import { AsyncStorage, ScrollView, ToastAndroid, View, Text } from 'react-native';
import { WingBlank, WhiteSpace, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisTextarea,WisSearchHead, } from '@wis_component/form';   // form 
import { WisTable, } from '@wis_component/ul';   // ul 
import WISHttpUtils from '@wis_component/http'; 
import {getNowDate,getNowTime} from '../../utils/date'; 

// 库内盘点 1
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      currentPage:1,
      totalPage:20,   
      columns:{
        "ZNO":"序号",
        "ZPART": "区域编码",
        "ZSTATUS": "盘点状态",//1：盘点中； 2：盘点完成
        "ZTNO":"任务号"
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
    zwtype: "2",
    zsdate:getNowDate()};
    const {navigation} = this.props;
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

/**
   * 结束盘点任务
   * @param {} option 
   */
  async endPatrolTask(){
    
    let selectData=this.refs.tableRef.getSelectData();  // 选中数据
     
    if(selectData.length===0||selectData[0].ZSTATUS!="盘点中"){
      ToastAndroid.show("未选择数据或状态不是 盘点中",ToastAndroid.SHORT); 
      return;
    }
    let params={
      werks:await AsyncStorage.getItem("werks"),
      lgort:await AsyncStorage.getItem("lgort"),
      zwtype: "2",
      zendate:getNowDate(),
      zentime:getNowTime(),
      zednam:await AsyncStorage.getItem("userName"),
      ztno:selectData[0].ZTNO,
      zpart:selectData[0].ZPART
    };
    WISHttpUtils.post("app/patrolStorehouse/endPatrolTask",params, (result) => {
      if(result){
        this.getData();
      }else{
        ToastAndroid.show("error",ToastAndroid.SHORT);          
      }
    });
  }
  
  /**
   *  创建盘点任务
   */
  async createPatrolTask(){
    let selectData=this.refs.tableRef.getSelectData();  // 选中数据
    if(selectData.length===0||selectData[0].ZSTATUS!="未盘点"){
      ToastAndroid.show("未选择数据或状态不是 未盘点",ToastAndroid.SHORT); 
      return;
    }
    let params={
      werks:await AsyncStorage.getItem("werks"),
      lgort:await AsyncStorage.getItem("lgort"),
      zwtype: "2",
      zstdate:getNowDate(),
      zsttime:getNowTime(),
      zcrnam:await AsyncStorage.getItem("userName"),
      zpart:selectData[0].ZPART
    };
    WISHttpUtils.post("app/patrolStorehouse/createPatrolTask",params, (result) => {
      if(result){
        this.getData();
      }else{
        ToastAndroid.show("error",ToastAndroid.SHORT);          
      }
    });
  }

  async onClick(row){
    if(!row.ZTNO){
      return;
    }
    const {navigation} = this.props;
    navigation.navigate('Inventory2',row) 
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
              onClickRow={(row)=>{
                this.onClick(row)
              }}
              currentPage={currentPage}   // 当前页
              totalPage={totalPage}       // 总页数
              columns={this.state.columns} // columns 配置列
              data={this.state.dataList}  // table 数据
 
            />
            <WingBlank >

            <View style={{height:60,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16}}>
              <Button type="ghost" onPress={()=> this.createPatrolTask()}>创建任务</Button>
              <Button type="ghost" onPress={()=> this.endPatrolTask()}>盘点完成</Button>
            
            </View>


            </WingBlank>
        </ScrollView>
    );
  }
}



export default PageForm;

