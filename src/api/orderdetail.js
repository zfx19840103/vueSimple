import request from '@/utils/request'
import Cookie from 'js-cookie'
import qs from 'qs';
import API from './global';

export function orderinfo(data) {
    return new Promise((resolve, reject) => {
        request
            .get(`${API}/openapi/user/order/info?${qs.stringify(data)}`)
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });
    
}

export function paycreate(data) {
    return new Promise((resolve, reject) => {
        request
            .post(`${API}/openapi/user/order/create`, qs.stringify(data))
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });
    
}

export function payovertime(data) {
    return new Promise((resolve, reject) => {
        request
            .post(`${API}/openapi/user/order/pay/overtime`, qs.stringify(data))
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });
    
}

export function paypolling(data) {
    return new Promise((resolve, reject) => {
        request
            .get(`${API}/openapi/user/order/status?${qs.stringify(data)}`)
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });
    
}

