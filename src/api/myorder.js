import request from '@/utils/request'
import Cookie from 'js-cookie'
import qs from 'qs';
import API from './global';


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

export function gotoPay(data) {
    return new Promise((resolve, reject) => {
        request
            .post(`/`, {
                headers: {
                    'Authorization': 'Bearer'
                }
            })
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });

}