import React from 'react';
import { window,TouchableOpacity,ToastAndroid,Text, View, StyleSheet } from 'react-native';
import { Icon,Button, Provider, InputItem, List, Toast } from '@ant-design/react-native';
import { createForm, formShape } from 'rc-form';

import WISHttpUtils from '@wis_component/http';   // http 
import AsyncStorage from '@react-native-async-storage/async-storage'

class LoginScreenForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      toggleEye:true,  // 显示密码

      userName:"XX-DENGSL",
      password:"1QAZ2wsx",
    };
  }

  componentDidMount() {

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
          Toast.fail('用户名或密码未填！');
        } else{
          const {navigation} = that.props;


          fetch("http://182.168.1.132:9900/"+"api-uaa/oauth/user/token",{
            method:'POST',
            headers:{
                // 'Content-Type': 'application/json;charset=UTF-8',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic d2ViQXBwOndlYkFwcA=='
            },
            body: "username=admin&password=1&lang=zh_CN&j_captcha=1&customKey='toName=home'"
        })
        .then((response) => {
            if(response.ok){
              return response.json();
            }
        })
        .then((json) => {
            var token=json.data.access_token;


            if(json){
              // 缓存 token
              AsyncStorage.setItem("_token",token).then(()=>{
                navigation.navigate('Home');
              });
            } else{
              ToastAndroid.show(json["message"],ToastAndroid.SHORT);
            }




            AsyncStorage.getItem("_token").then((data)=>{
              console.log("fanfan 8989");
              console.log(data);

            });
        })
       
        }
    });
  }


  render() {

    const {navigation} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    const {userName,password,toggleEye}=this.state;
  
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
              <Text style={styles.headTitleText}>Supply Link</Text>
            </View>

            <View style={{height:50}}></View>

              <View style={{paddingRight:18}}>
                <InputItem
                  {...getFieldProps('userName',{
                    rules:[{required:true}],
                    initialValue:userName
                  })}
                  error={getFieldError('userName')}
                  placeholder=""
                >
                  用户名
                </InputItem>

                <InputItem
                  {...getFieldProps('password',{
                    rules:[{required:true}],
                    initialValue:password
                  })}
                  error={getFieldError('password')}
                  type={toggleEye?"password":"text"}
                  extra={
                    <TouchableOpacity onPress={()=>{
                        this.setState({
                          toggleEye:!toggleEye
                        });
                    }}>
                      <Icon name={toggleEye?"eye-invisible":"eye"} />
                    </TouchableOpacity>
                  
                  }
                  placeholder=""
                >
                  密码
                </InputItem>
              </View>
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
    fontStyle:'italic',
    textAlign:"center"
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