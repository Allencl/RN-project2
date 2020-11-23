import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, AsyncStorage, ToastAndroid, } from 'react-native';
import { WingBlank, DatePicker, List, Tag, WhiteSpace, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisSearchHead, } from '@wis_component/form';   // form 
import { WisTable, } from '@wis_component/ul';   // ul 

import WISHttpUtils from '@wis_component/http'; 
import {getNowDate,getNowTime,getDate} from '../../utils/date';
// 库内盘点 2
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      currentPage:1,
      totalPage:20,
      date:'',
      num:0, 
      columns:{
        ZPART:"区域",
        ZONUM:"待提车数"
      },
      dataList:[]
    }
  }
  componentDidMount(){
    this.setState({
      date:getNowDate()
    })
    this.getData(  getNowDate() );
  }
  async getData(date){
 
    let that=this;
    let params={
    werks: await AsyncStorage.getItem("werks"),
    lgort: await AsyncStorage.getItem("lgort"),
    zsdate:date};

    this.setState({date:date})
    WISHttpUtils.post("app/mentionCar/getRegionalQuantityToBeSent",params, (result) => {
  
      let data=result.data.ITEM;
      if(result.data.ITEM){
        that.setState({
          dataList:result.data.ITEM,
          num:result.data.ITEM.length
        });
        this.refs.tableRef.updateTable()
      }else{
        ToastAndroid.show("error",ToastAndroid.SHORT);          
      }
    });
  }
  /**
   * 勾选后点击确定
   * @param {} option 
   */
  determine(){
    let selectData=this.refs.tableRef.getSelectData();  // 选中数据
  }

  async onClick(row){
    // if(!row.ZTNO){
    //   return;
    // }
    const {navigation} = this.props;
    row.date=this.state.date
    navigation.navigate('Vehicle2',row) 
  }




  render() {
    let {currentPage,totalPage,date,num} = this.state;
    let {navigation} = this.props;

    return (
        <ScrollView style={{paddingTop:0,backgroundColor:"white"}}>

            <View>
          
                <WisDatePicker
                    lableName="计划日期"
                    defaultValue={new Date()}
                    onChangeValue={(value)=>{
                        // 返回日期对象
                        this.getData( getDate(value) );
                    }}
                />
                <WisInput 
                    lableName={"待提车辆总数"}
                    value={num+''}
                    disabled                    
                />
            </View>

            <WisTable 
              ref="tableRef"
              onClickRow={(row)=>{
                this.onClick(row)
              }}
              currentPage={1}   // 当前页
              totalPage={1}       // 总页数
              columns={this.state.columns} // columns 配置列
              data={this.state.dataList}  // table 数据
 
            />

            <WingBlank >
            <View style={{height:60,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16}}>
              {/* <Button type="ghost" onPress={() =>  this.determine() }>确定</Button> */}
            </View>
            </WingBlank>
        </ScrollView>
    );
  }
}



export default PageForm;

