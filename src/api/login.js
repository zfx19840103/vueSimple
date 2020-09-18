import request from '@/utils/request'
import Cookie from 'js-cookie'
import qs from 'qs';
import API from './global';

export function loginPost(data) {
    return new Promise((resolve, reject) => {
        request
            .post(`${API}/openapi/auth/message/login`, qs.stringify(data))
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });
    
}

export function pushCode(data) {
    return new Promise((resolve, reject) => {
        request
            .get(`${API}/openapi/auth/send/message?${qs.stringify(data)}`)
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });

}

export function logout() {
    return new Promise((resolve, reject) => {
        request
            .get(`${API}/openapi/quit`)
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });

}
