import request from '@/utils/request'
import Cookie from 'js-cookie'
import qs from 'qs';
import API from './global';

export function orderrefund(data) {
    return new Promise((resolve, reject) => {
        request
            .post(`${API}/openapi/user/order/refund`, qs.stringify(data))
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });
    
}

export function orderlist(data) {
    return new Promise((resolve, reject) => {
        request
            .get(`${API}/openapi/user/order/list?${qs.stringify(data)}`)
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });
    
}
