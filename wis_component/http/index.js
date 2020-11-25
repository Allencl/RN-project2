import React,{Component} from 'react';
import Config from 'react-native-config';

import {
    ToastAndroid,
} from 'react-native';
//const base_url="http://182.168.1.19:8088/";
//const base_url="http://60.222.227.231:10080/sit/";
// const base_url=Config.base_url;
const base_url="http://182.168.1.132:9900/";

/**
 * 网络请求的工具类
 * 方法是静态的 可以直接 WISHttpUtils.post|get
 */
export default class WISHttpUtils extends Component{
    constructor(props){
        super(props); 
    }

    /**
     * 普通的get请求 
     * @param {*} url 地址
     * @param {*} params  参数
     * @param {*} callback  成功后的回调
     */
    static get(url,params,callback){
       fetch(base_url+url,{
        method:'GET',
        body:params
        })
        .then((response) => {
            if(response.ok){//如果相应码为200
                return response.json(); //将字符串转换为json对象
            }
        })
        .then((json) => {
            //根据接口规范在此判断是否成功，成功后则回调
            if(json.success){
                callback(json);
            }else{
                //否则不正确，则进行消息提示
                //ToastAndroid 只针对安卓平台，并不跨平台
                ToastAndroid.show(json.message,ToastAndroid.SHORT);
            }
        }).catch(error => {
            ToastAndroid.show("netword error",ToastAndroid.SHORT);
        });
    };

  

    /**
     * post json形式  header为'Content-Type': 'application/json'
     * @param {*} url 
     * @param {*} params 
     * @param {*} callback 
     */
    static post(url,params,callback){
        try {

            // let formdata = new FormData();
            // formdata.append("lang","zh_CN");
            // formdata.append("username","admin");
            // formdata.append("password","1");
            // formdata.append("j_captcha","NO");
            // formdata.append("customKey","toName=home");



            
            fetch(base_url+url,{
                    method:'POST',
                    headers:{
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': 'Basic W29iamVjdCBPYmplY3Rd'
                    },
                    body:JSON.stringify(params),//json对象转换为string
                    // body: formdata
                })
                .then((response) => {
                    console.log(response);
                    // if(response.ok){
                    //     return response.json();
                    // }
                })
                .then((json) => {
                    // if(json.success){
                    //     callback(json);
                    // }else{
                    //     ToastAndroid.show(json.message,ToastAndroid.SHORT);
                    // }
                })
        } catch (error) {
            console.log(e)
            // .catch(error => {
            //     ToastAndroid.show("netword error",ToastAndroid.SHORT);
            // });
        }
        
    };
}