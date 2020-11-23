import React, { Component } from 'react';
import { AsyncStorage, ScrollView, ToastAndroid, View, Text } from 'react-native';
import { WingBlank, WhiteSpace, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisTextarea,WisSearchHead, } from '@wis_component/form';   // form 
import { WisTable, } from '@wis_component/ul';   // ul
import WISHttpUtils from '@wis_component/http'; 
import {getNowDate,getNowTime} from '../../utils/date';

// 查询头
class SearchForm extends Component {

  /**
   * 提交 查询
   * @param
   */
  onSearch(){
    let{onSearch}=this.props;

    this.props.form.validateFields((error, value) => {
        // 表单 不完整
        if(error){
          Toast.fail('必填字段未填!');
        } else{
          onSearch(value);
        }
    });
  }

    render(){
      const {getFieldProps} = this.props.form;

      return(
        <View>
            <WisSearchHead onSearch={()=> this.onSearch() } />

            <ScrollView style={{maxHeight:300}}>
              <WisInput 
                {...getFieldProps('user1')}        
                lableName="入库单号111"
              />                                                         
            </ScrollView>                 
        </View>
      );
    }
}
let SearchFormHTML=createForm()(SearchForm);

// 页面
class ConventionPage extends Component {

  constructor(props) {
    super(props);

    this.state={
      currentPage:1,
      totalPage:20,   
      columns:{
        "ZNO":"序号",
        "ZPART": "区域编码",
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
    zwtype: "1",
    zsdate:getNowDate()};

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
   * 结束巡库任务
   * @param {} option 
   */
  async endPatrolTask(){
    let selectData=this.refs.tableRef.getSelectData();  // 选中数据
     
    if(selectData.length===0){
      return;
    }
    let params={
      werks:await AsyncStorage.getItem("werks"),
      lgort:await AsyncStorage.getItem("lgort"),
      zwtype: "1",
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
   *  创建巡库任务
   */
  async createPatrolTask(){
    let selectData=this.refs.tableRef.getSelectData();  // 选中数据
    if(selectData.length===0){
      return;
    }
    let params={
      werks:await AsyncStorage.getItem("werks"),
      lgort:await AsyncStorage.getItem("lgort"),
      zwtype: "1",
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
    let params ={
      werks:await AsyncStorage.getItem("werks"),
      lgort:await AsyncStorage.getItem("lgort"),
      ztno:row.ZTNO,
      zdate:getNowDate(),
    }
    const {navigation} = this.props;
    //跳转前检查
    WISHttpUtils.post("app/patrolStorehouse/getPatrolTaskCreateTime",params, (result) => {
      if(result.success&&result.data.STATUS==="S"){
        navigation.navigate('Convention2',{data:row}) 
      }else{
        if(!result.success){
          ToastAndroid.show(result.message,ToastAndroid.SHORT);  
        }else{
          ToastAndroid.show(result.data.MESSAGE,ToastAndroid.SHORT);  
        }      
      }
    });
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
    let {dataList,columns} = this.state;

    return (
        <ScrollView style={{paddingTop:0,backgroundColor:"white"}}>

            <WisTable 
              ref="tableRef"
              single={true}        // 是否 单选
              currentPage={1}   // 当前页
              totalPage={1}       // 总页数
              columns={columns} // columns 配置列
              data={dataList}  // table 数据
              //searchHTML={<SearchFormHTML   // 查询头
              //  onSearch={(value)=>{
                  // 表单值
              //  }}
              ///>}  
              onClickRow={(row)=>{
                this.onClick(row)
              }}
            />

            <WingBlank >

            <View style={{height:60,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16}}>
              <Button type="ghost" onPress={()=> this.createPatrolTask()}>创建任务</Button>
              <Button type="ghost" onPress={()=> this.endPatrolTask()}>巡库完毕</Button>
            </View>


            </WingBlank>
        </ScrollView>
    );
  }
}



export default ConventionPage;

