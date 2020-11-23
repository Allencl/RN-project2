import React, { Component } from 'react';
import { AsyncStorage, ScrollView, List, View, ToastAndroid } from 'react-native';
import { WingBlank, WhiteSpace, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisTextarea,WisCamera, } from '@wis_component/form';   // form 
import { WisTable, } from '@wis_component/ul';   // ul 
import {getNowDate,getNowTime} from '../../utils/date'; 
import WISHttpUtils from '@wis_component/http'; 
//  电池状态维护 2
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      currentPage:1,
      totalPage:20,   
      columns:{
        MATNR:"物料编号",
        EQUNR:"VIN码",
        ZBIN:"仓位",
        ZDAYS:"在库天数"
      },
      dataList:[]
    }
  }

  componentDidMount(){
    this.getData();
  }




  async getData(){
    let that=this;
    let routeParams = this.props.route.params.routeParams;   
    let params={
    werks: await AsyncStorage.getItem("werks"),
    lgort: await AsyncStorage.getItem("lgort"),
    zpart: routeParams.ZPART, //电池维护
    zsedate:getNowDate()
  };
 
    WISHttpUtils.post("app/battery/getVehicleWarehousingTime",params, (result) => {
      let data=result.data;
      if(data[0].STATUS=="S"){
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
  onClick(row){
  this.onChange(row.EQUNR)
  }
  onChange(data){
    const {navigation} = this.props;
    let routeParams = this.props.route.params.routeParams;
    let dataList=this.state.dataList;
    var arr = this.state.dataList.map(function(o) {return o.EQUNR;});
    let i=arr.indexOf(data);
    if(i>-1){
      //跳转 
      let params ={
        ZPART:routeParams.ZPART,
        EQUNR:data,
        MATNR:dataList[i].MATNR,
        ZBIN:dataList[i].ZBIN,
        ZDAYS:dataList[i].ZDAYS
      }
      navigation.push('Status3',params) 
    }else{
      ToastAndroid.show("VIN码 不在列表中",ToastAndroid.SHORT);          
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
                <WisCamera      
                  lableName="VIN码"
                  onChangeValue={(data)=>{
                    this.onChange(data.data)
                  }}
                />
            </View>
            <WisTable 
              ref="tableRef"
              single={false}        // 是否 单选
              currentPage={1}   // 当前页
              totalPage={1}       // 总页数
              columns={this.state.columns} // columns 配置列
              data={this.state.dataList}  // table 数据
            />

            <WingBlank >

            <View style={{height:60,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16}}>
                {/*<Button type="ghost" onPress={()=> navigation.navigate('Status3') }>下一页</Button>*/}
              
                {/* <Button type="ghost" onPress={()=> this.getSelectDataHandle()}>确认</Button> */}
            </View>


            </WingBlank>
        </ScrollView>
    );
  }
}



export default PageForm;

