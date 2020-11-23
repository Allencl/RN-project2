import React, { Component,useState } from 'react';
import { Dimensions,FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Icon, Button, Toast, Modal } from '@ant-design/react-native';
import CheckBox from '@react-native-community/checkbox';


// table
class TableComponent extends Component {

  constructor(props) {
    super(props);

    const {data=[]}=this.props;

    this.state={
      modalToggle:false,  // 查询 弹框
      data:data,
      documentWidth:((Dimensions.get('window').width*0.5)-20).toFixed(0), 
    };
  }


  /**
   * 打开 弹框
   */
  onOpen(){
    this.setState({modalToggle:true});
  }  

  /**
   * 关闭 弹框
   */
  onClose(){
    this.setState({modalToggle:false});
  }

  /**
   * 获取选中数据
   */
  getSelectData(){
    let {data}=this.state;
    let newData=JSON.parse(JSON.stringify(data));

    return newData.filter(o=>o["_checked"]);
  }


  /**
   * 更新 table
   */
  updateTable(){
    const {data=[]}=this.props;
    this.setState({
      data:data 
    });    
  }


  /**
   * 
   * @param {状态} action 
   */
  onChangePageHandle(action){

    let {currentPage,totalPage,onChangePage}=this.props;

    switch (action) {
      case "previous":   // 上一页
        if(currentPage>1){
          onChangePage({
            action:"previous",
            targetPage: currentPage-1
          });
        }else{
          Toast.info('当前第一页！',1);
        }
        break;
      case "next":      // 下一页
        if(currentPage<totalPage){
          onChangePage({
            action:"next",
            targetPage: currentPage+1
          });        
        } else{
          Toast.info('当前最后一页！',1);
        }  
        break;    
      default:
        break;
    }

  }


  /**
   * checkbox change
   * @param {*} item 
   * @param {*} index 
   */
  checkBoxChange(item,index){
    let{data}=this.state;
    let{single=false}=this.props;
    let newData=JSON.parse(JSON.stringify(data));

    // 单选
    if(single){
      newData.map(o=>o["_checked"]=false);
    }

    newData[index]["_checked"]=!(item["_checked"]||false);
    this.setState({
      data: newData
    });
  }

  /**
   * 
   * @param {*} item row
   */
  renderItemHandle(item,index){
    const {onClickRow,columns={},titleKey,checkBox=true}=this.props;
    let {documentWidth}=this.state;


    return (
      <TouchableOpacity key={String(index)} disabled={!!!onClickRow?true:false} onPress={()=>{
          if( onClickRow ) onClickRow(item,index); 
      }}>
        <View style={styles.rowContainer}>
          <View style={{flexDirection: "row",justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:"#ccc"}}>
              <View style={styles.checkBoxContainer}>
                { checkBox ?
                  <CheckBox
                    value={(item["_checked"]||false)}
                    onValueChange={()=> this.checkBoxChange(item,index)}
                    style={styles.checkbox}
                  />
                : <View style={{height:32,width:8}}></View>

                }

                <Text numberOfLines={1} style={styles.headText}>{ titleKey?item[titleKey]:(index+1) }</Text>
              </View>
              <View>
                { onClickRow ? 
                    <Icon style={{paddingTop:8,paddingRight:6,fontSize:16,color:"#000"}} name="right" />
                    :
                    <Text> </Text>
                }
              </View>
          </View>

          <View style={styles.contentContainer}>
            { Object.entries(columns).map((o,i)=>{
              return (<View style={{...styles.rowCell,width:Number(documentWidth)}} key={i}>
                  {/* <Text style={styles.rowCellLabel} numberOfLines={3}>大苏打wewe121212是的是的</Text>
                  <Text style={styles.rowCellText} numberOfLines={5}>12121dfd对方对方的fdfdfdfdf反对反对反对反对反对反对</Text> */}

                  <Text style={styles.rowCellLabel} numberOfLines={2}>{o[1]}</Text>
                  <Text style={styles.rowCellText} numberOfLines={5}>{item[o[0]]}</Text>
                </View>)
              })
            }
            
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {modalToggle, data=[]}=this.state;
    const {searchHTML, maxHeight, currentPage, totalPage, onChangePage, onRefresh}=this.props;

    return (
      <View style={styles.container}>

        <Modal
          visible={modalToggle} 
          maskClosable
          onClose={()=>this.onClose()}

          // closable
          // transparent
          // popup
          
          // transparent
          // maskClosable
          
          // footer={footerButtons}
        >
          <View style={{ paddingVertical: 20 }}>
            {searchHTML}
          </View>

        </Modal>



        <View style={styles.footerContainer}>

            <View style={{...styles.footerContainerConfig,paddingTop:6}}>
              {/* <Text style={{paddingLeft:12}}>共</Text>
              <Text numberOfLines={1} style={{paddingLeft:6,paddingRight:6,maxWidth:80,textAlign:'center'}}>1200</Text>
              <Text>条</Text> */}

              <Text style={{fontSize:16,paddingLeft:6}}>第</Text>
              <Text numberOfLines={1} style={{fontSize:16,paddingLeft:6,paddingRight:6,maxWidth:80,textAlign:'center'}}>{currentPage}</Text>
              <Text style={{fontSize:16}}>页</Text>

              <Text style={{paddingLeft:12,fontSize:16}}>共</Text>
              <Text numberOfLines={1} style={{fontSize:16,paddingLeft:6,paddingRight:6,maxWidth:80,textAlign:'center'}}>{totalPage}</Text>
              <Text style={{fontSize:16}}>页</Text>

              { onRefresh ?
                <TouchableOpacity onPress={()=>{
                  onRefresh();
                }}>
                  <View style={{paddingLeft:10}}>
                    <Icon name="sync" color="#009966"/>
                  </View>
                </TouchableOpacity>
                :
                <View></View>
              }


            </View>


            <View style={styles.footerContainerConfig}>
              { searchHTML ?
                <TouchableOpacity onPress={()=>this.onOpen() }>
                  <Icon style={{...styles.pagingIcon,marginTop:2,marginRight:18}} name="search" />
                </TouchableOpacity>
                : <Text></Text>
              }

              { onChangePage ?
                <TouchableOpacity onPress={()=>this.onChangePageHandle("previous") }>
                  <Icon style={{...styles.pagingIcon,marginRight:11}} name="left-circle" />
                </TouchableOpacity>
                : <Text></Text>
              }

              { onChangePage ?
                <TouchableOpacity onPress={()=>this.onChangePageHandle("next") }>
                  <Icon style={styles.pagingIcon} name="right-circle" />
                </TouchableOpacity>
                :<Text></Text>

              }
            </View>

        </View>


        {/* <FlatList
          // style={{maxHeight:maxHeight||460}}
          data={data}
          renderItem={({item,index}) => this.renderItemHandle(item,index) }
          keyExtractor={(item,_index) => String(_index)}
        /> */}

        <View>
          {
            data.map((item,index)=>{
              return this.renderItemHandle(item,index);
            })
          }
        </View>


    </View>
    );
  }
}

const styles = StyleSheet.create({
  rowContainer:{
    marginBottom:16,
    borderWidth:1,
    borderColor:"#ccc",

  },
  container: {
    paddingLeft:6,
    paddingRight:6,
    paddingTop:8,
    paddingBottom:8,

  },
  checkBoxContainer:{
    flexDirection: "row",
  },
  headText:{
    paddingTop:5,
    paddingLeft:2,
    fontSize:16,
    fontWeight:"bold",
    width:260,
    // backgroundColor:"red"
  },
  checkbox:{
    // fontSize:22

    // checkColor:"red"
  },
  contentContainer:{
    flexDirection: "row",
    flexWrap:'wrap',
    justifyContent:'space-between',

    borderBottomWidth:1,
    borderBottomColor:"#ccc",
    paddingLeft:8,
    paddingRight:8,
    paddingTop:8,
    paddingBottom:8
  },
  rowCell:{
    // flex:5,
    // borderColor:"red",
    // borderWidth:1,


    // flexDirection:"wrap",
    
    // justifyContent:'space-between',
    flexDirection: "row",
    paddingTop:3,
    paddingBottom:3,

    // backgroundColor:"red"
  },
  rowCellLabel:{
    flex:5,
    fontSize:15,
    textAlign: 'right',
    // width:100,
    // backgroundColor:"blue"
  },
  rowCellText:{
    flex:5,
    fontSize:15,
    paddingLeft:8,
    textAlign: 'left',
    // width:220,
    // backgroundColor:"red"
  },
  footerContainer:{
    flexDirection: "row",
    justifyContent:'space-between',
    marginTop:12,
    marginBottom:16,
    // backgroundColor:"red"
  },
  footerContainerConfig:{
    flexDirection: "row",
  },
  pagingIcon:{
    color:"#003399", 
    fontSize:28,
    marginRight:6
  },  
  footerContainerConfig:{
    flexDirection: "row",
    justifyContent:'space-between',
  },


});

export default TableComponent;