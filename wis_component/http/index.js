import React,{Component} from 'react';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {origin} from './origin';     // 服务地址

import {ToastAndroid,DeviceEventEmitter} from 'react-native';


/**
 * 网络请求的工具类
 * 方法是静态的 可以直接 WISHttpUtils.post|get
 */
export default class WISHttpUtils extends Component{
    constructor(props){
        super(props); 
    }

    /**
     * 获取服务器 地址
     */
    static getHttpOrigin(){  
        return origin;
    }      


    /**
     * 普通的get请求 
     * @param {*} url 地址
     * @param {*} params  参数
     * @param {*} callback  成功后的回调
     */
    static get(url,params,callback){        
    //    fetch(origin+url,{
    //     method:'GET',
    //     body:params
    //     })
    //     .then((response) => {
    //         if(response.ok){//如果相应码为200
    //             return response.json(); //将字符串转换为json对象
    //         }
    //     })
    //     .then((json) => {
    //         //根据接口规范在此判断是否成功，成功后则回调
    //         if(json.success){
    //             callback(json);
    //         }else{
    //             //否则不正确，则进行消息提示
    //             //ToastAndroid 只针对安卓平台，并不跨平台
    //             ToastAndroid.show(json.message,ToastAndroid.SHORT);
    //         }
    //     }).catch(error => {
    //         ToastAndroid.show("netword error",ToastAndroid.SHORT);
    //     });
    };

  

    /**
     * @param {*} url 
     * @param {*} params 
     * @param {*} callback 
     */
    static post(url,option,callback){
        try {


            // 模拟 form 数据提交
            var formData = '';
            Object.entries(option["params"]).map((o)=>formData+='&'+o[0]+'='+String(o[1]));
            // console.log(data);
            
            AsyncStorage.getItem("_token").then((data)=>{

                // open loding
                DeviceEventEmitter.emit('globalEmitter_toggle_loding',true);


                fetch(origin+url,{
                    method:'POST',
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer '+data
                    },
                    // body: formData
                    body: formData.slice(1)
                })
                .then((response) => {


                    console.log(response);
                    console.log(response.json());
                    console.log(111);


                    // 关闭 loding
                    DeviceEventEmitter.emit('globalEmitter_toggle_loding',false);

                    // 如果相应码为200 将字符串转换为json对象
                    if(response.ok){
                        return response.json(); 
                    }                    
                })
                .then((json) => {
                    console.log(json);
                    console.log(333);

                    // 提示
                    if(json && json["message"]){
                        ToastAndroid.show(json["message"],ToastAndroid.SHORT);
                    }

                    // 返回数据
                    if(json){
                        callback(json);
                    }
                })
                .catch(error => {
                    // ToastAndroid.show("netword error",ToastAndroid.SHORT);
                });                
            });
        } catch (error) {
            // console.log(e)
            // // .catch(error => {
            // //     ToastAndroid.show("netword error",ToastAndroid.SHORT);
            // // });
        }
        
    };
}