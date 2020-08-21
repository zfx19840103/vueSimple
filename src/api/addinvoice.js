import request from '@/utils/request'
import Cookie from 'js-cookie'
import qs from 'qs';
import API from './global';

export function getData(data) {
    return new Promise((resolve, reject) => {
        request
            .get(`${API}/openapi/user/invoice/list`)
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });    
}

export function deleteinvoice(data) {
    return new Promise((resolve, reject) => {
        request
            .post(`${API}/openapi/user/invoice/remove`, qs.stringify(data))
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });    
}