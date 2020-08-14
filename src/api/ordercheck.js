import request from '@/utils/request'
import Cookie from 'js-cookie'
import qs from 'qs';
import API from './global';

export function getaddresslistdata(data) {
    return new Promise((resolve, reject) => {
        request
            .get(`${API}/openapi/user/address/list?${qs.stringify(data)}`)
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });
    
}

export function skuinfo() {
    return new Promise((resolve, reject) => {
        request
            .get(`${API}/openapi/activity/byte/sku/info`)
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });

}

export function deleteaddress(data) {
    return new Promise((resolve, reject) => {
        request
            .post(`${API}/openapi/user/delete/address`, qs.stringify(data))
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });

}

export function ordercreateapi(data) {
    return new Promise((resolve, reject) => {
        request
            .post(`${API}/user/order/create/bytemoon_pay`, qs.stringify(data))
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });

}

export function orderpollingpay() {
    return new Promise((resolve, reject) => {
        request
            .get(`${API}/openapi/user/order/status`)
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });

}