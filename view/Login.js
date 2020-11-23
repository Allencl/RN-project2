import React from 'react';
import { AsyncStorage,ToastAndroid,Text, View, StyleSheet } from 'react-native';
import { Button, Provider, InputItem, List, Toast } from '@ant-design/react-native';
import { createForm, formShape } from 'rc-form';

//import HttpWIS from '@wis_component/http/';   // http 
import WISHttpUtils from '@wis_component/http';   // http 
import { WisSelect} from '@wis_component/form';   // form 
import { get } from 'react-native/Libraries/Utilities/PixelRatio';
 
class LoginScreenForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lgort:'3005',       // 地点
      werks:'1031',   // 工厂
      bname:"XX-DENGSL",
      bcode:"1QAZ2wsx",
      werksArray:[],
      lgortArray:[],
      map:{}
    };
  }

  componentDidMount() {
    //判断 是否登录过
    this.check();
    this.getWerks();
  }
  async check(){
    let werks= await AsyncStorage.getItem("werks");
    let lgort= await AsyncStorage.getItem("lgort");
    let bname= await AsyncStorage.getItem("userName");
    let bcode= await AsyncStorage.getItem("bcode");
    if(werks&lgort&bname&bcode) {
      //跳转home
      const {navigation} = this.props;
      navigation.navigate('Home')
    }
  }

  getLgort(zactin){
    let lgortArray=this.state.lgortArray;
    let map=this.state.map;
    lgortArray=map[zactin];
    this.setState({
      lgortArray
    });
  }
  

  getWerks(){
    let params={
      zactin:''
    };
    WISHttpUtils.post("/app/master/getWerks",params, (result) => {
      let data=result.data;
      if(data){
        //处理 工厂数据
        this.setWerksArray(data)
        this.setMap(data);
        this.props.form.resetFields()
      }else{
       // ToastAndroid.show(data[0].MESSAGE,ToastAndroid.SHORT);          
      }
    });
  }
  setWerksArray(data){
    let werksArray=this.state.werksArray;
    let obj = {};//去重用
    werksArray=[];
    data.forEach(element => {
      let children={
        label:element.NAME1,
        value:element.WERKS,
      };
      if(!obj[element.WERKS]){
        obj[element.WERKS] = true;
        werksArray.push(children);
      }
    });
    this.setState({
      werksArray
    });

  }

  setMap(data){
    let map =this.state.map;
    map={};
    map = this.groupBy(data, function (item) {
        return item.WERKS;
      });
    this.setState({
       map
    }); 
  }

  groupBy(array, f) {
    const groups = {};
    array.forEach(function (o) {
      const group = JSON.stringify(f(o));
      let children={
        label:o.LGOBE,
        value:o.LGORT,
      }; 
      groups[group] = groups[group] || [];
      groups[group].push(children);
    });
    return groups;
  }

  /**
   * 登录
   * @param
   */
   submit = () => {
    let that=this;
     
    that.props.form.validateFields((error, value) => {
        // 表单 不完整
        if(error){
          Toast.fail('必填字段未填!');
        } else{
          const {navigation} = that.props;
          // 保存数据
          WISHttpUtils.post("app/user/auth", value, (result) => {
            //可能要存TOKEN
            if(result.data.STATUS==="S"){
              //跳转页面 ===>首页
              this.setAsyncStorage(value)

              navigation.navigate('Home')
            }else{
              ToastAndroid.show(result.data.MESSAGE,ToastAndroid.SHORT);         
            }
          });
         
        }
    });
  }

 async setAsyncStorage(value){
  let werks= value.werks+'';
  let lgort= value.lgort+'';
  let bname= value.bname+'';
  let bcode= value.bcode+'';
  await AsyncStorage.setItem("werks",werks);
  await AsyncStorage.setItem("lgort",lgort);
  await AsyncStorage.setItem("userName",bname);
  await AsyncStorage.setItem("bcode",bcode);
  }
  render() {

    const {navigation} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    const {werks,lgort,bname,bcode,werksArray,lgortArray}=this.state;
  
    return (
      <Provider>
        <View
          style={styles.container}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <List>

            <View style={styles.headTitle}>
              <Text style={styles.headTitleText}>大 运</Text>
            </View>
            <View>
                <WisSelect 
                    childrenList={werksArray}
                    name="werks"
                    form={this.props.form}
                    {...getFieldProps('werks',{
                      rules:[{required:true}],
                      initialValue:werks
                    })}                    
                    lableName="工厂"
                    // defaultValue="3"
                     onChangeValue={(value)=>{
                      this.getLgort(value)
                     }}       
                /> 


                <WisSelect 
                    childrenList={lgortArray}
                    name="lgort"
                    form={this.props.form}
                    {...getFieldProps('lgort',{
                      rules:[{required:true}],
                      initialValue:lgort
                    })}                       
                    lableName="库存地点"
                    
                    // defaultValue="22"
                    // onChangeValue={(value)=>{
                    // }}                  
                /> 


            </View>

            <View style={{height:50}}></View>


            <InputItem
              {...getFieldProps('bname',{
                rules:[{required:true}],
                initialValue:bname
              })}
              error={getFieldError('bname')}
              placeholder=""
            >
              用户名
            </InputItem>

            <InputItem
              {...getFieldProps('bcode',{
                rules:[{required:true}],
                initialValue:bcode
              })}
              error={getFieldError('bcode')}
              placeholder=""
            >
              密码
            </InputItem>
            <List.Item style={styles.footerBox}>
              <Button
                style={styles.footerBtn}
                onPress={this.submit}
                // type="primary"
              >
                <Text style={{fontSize:22,color:"#fff"}}>登录</Text>
              </Button>
            </List.Item>
          </List>
        </View>
      </Provider>
    );
  }
}



const styles = StyleSheet.create({
  container:{
    flex: 1,    
    flexDirection: 'column',
    backgroundColor:"#fff"
  },
  headTitle:{
    paddingTop:60,
    paddingLeft:32,
    paddingBottom:50
  },
  headTitleText:{
    color:"#13c2c2",
    fontSize:46,
    fontWeight:"bold",
    fontStyle:'italic'
  },
  footerBox:{
    paddingTop:100
  },
  footerBtn:{
    backgroundColor:"#13c2c2",
    borderWidth:0,
    borderRadius:0,
    fontSize:32
  }

});


export default createForm()(LoginScreenForm);