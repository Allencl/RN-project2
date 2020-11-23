import React, { Component } from 'react';
import { AsyncStorage, ScrollView, ToastAndroid, View, Text } from 'react-native';
import { WingBlank, Tag, WhiteSpace, Toast, Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisCamera,WisSearchHead, } from '@wis_component/form';   // form 
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
      num:0,//已盘数量   
      ZPART:"区域",
      columns:{
        ZNO:"序号",
        EQUNR:"VIN码",
        ZBIN:"仓位"
      },
      dataList:[]
    }
  }
  componentDidMount(){
    this.getData("");
  }
  async getData(data){
    let that=this;
    let routeParams = this.props.route.params.routeParams;
    let params={
        werks : await AsyncStorage.getItem("werks"),
        lgort : await AsyncStorage.getItem("lgort"),
        zpart : routeParams.ZPART,
        ztno : routeParams.ZTNO,
        equnr :data,
        zcmdate : getNowDate(),
        zcmtime : getNowTime(),
    };
    const {navigation} = this.props;
    WISHttpUtils.post("app/inventory/updateAndObtainInventoryRecords",params, (result) => {
      let data=result.data;
      if(data[0].STATUS==="S"){
        that.setState({
          dataList:data,
          num:data.length,
          ZPART:routeParams.ZPART
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
 

  render() {
    let {currentPage,totalPage,num,ZPART} = this.state;
    let {navigation} = this.props;
    return (
        <ScrollView style={{paddingTop:0,backgroundColor:"white"}}>

            <View>
          
                <WisFormHead 
                    icon="tag" 
                    title={`区域：${ZPART}`}
                />
          
                <WisInput 
                    lableName={'已盘数量：'+num+''}
                    disabled
                />
                 
                <WisCamera      
                  lableName="VIN码"
                  onChangeValue={(data)=>{
                    this.getData(data.data)
                  }}
                />

            </View>

            <WisTable 
              ref="tableRef"
              checkBox={false}
              single={false}        // 是否 单选
              
              currentPage={1}   // 当前页
              totalPage={1}       // 总页数
              columns={this.state.columns} // columns 配置列
              data={this.state.dataList}  // table 数据
                // 页码切换
            />

            <WingBlank >

            </WingBlank>
        </ScrollView>
    );
  }
}



export default PageForm;

