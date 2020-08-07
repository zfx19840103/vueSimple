import request from '@/utils/request'
import Cookie from 'js-cookie'
import qs from 'qs';
import API from './global';

export function addaddress(data) {
    return new Promise((resolve, reject) => {
        request
            .post(`${API}/openapi/user/add/address`, qs.stringify(data))
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });

}

export function editaddress(data) {
    return new Promise((resolve, reject) => {
        request
            .post(`${API}/openapi/user/edit/address`, qs.stringify(data))
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });

}