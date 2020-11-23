import React,{Component} from 'react';

import {
    AsyncStorage
} from 'react-native';
const base_url="http://182.168.1.33:8088/";
import WISHttpUtils from '@wis_component/http';
/**
   *  获取区域信息
   */
export async function getWarehouseArea(params,callback) {
    defaultPost("app/patrolStorehouse/warehouseArea",params,callback)
}
/**
   *  结束巡库任务
   */
export async function endPatrolTask(params,callback) {
    defaultPost("app/patrolStorehouse/endPatrolTask",params,callback)
}
/**
   *  创建巡库任务
   */
  export async function createPatrolTask(params,callback) {
    defaultPost("app/patrolStorehouse/createPatrolTask",params,callback)
}

/**
   *  获取巡库任务创建日期
   */
  export async function getPatrolTaskCreateTime(params,callback) {
    defaultPost("app/patrolStorehouse/getPatrolTaskCreateTime",params,callback)
}


async function defaultPost(url,params,callback){
    params.werks= await AsyncStorage.getItem("werks");
    params.lgort= await AsyncStorage.getItem("lgort");
    WISHttpUtils.post(base_url+url,params,callback);
}

 