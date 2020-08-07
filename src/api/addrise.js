import request from '@/utils/request'
import Cookie from 'js-cookie'
import qs from 'qs';
import API from './global';

export function saverise(data) {
    return new Promise((resolve, reject) => {
        request
            .post(`${API}/openapi/user/invoice/add`, qs.stringify(data))
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });    
}

export function editrise(data) {
    return new Promise((resolve, reject) => {
        request
            .post(`${API}/openapi/user/invoice/edit`, qs.stringify(data))
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });    
}
