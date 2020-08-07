import request from '@/utils/request'
import Cookie from 'js-cookie'
import qs from 'qs';
import API from './global';

export function loginPost(data) {
    return new Promise((resolve, reject) => {
        request
            .post(`${API}/openapi/login`, qs.stringify(data))
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
            .post(`${API}/openapi/send/captcha`, qs.stringify(data))
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });

}

export function verify(data) {
    return new Promise((resolve, reject) => {
        request
            .post(`${API}/openapi/user/verify`, qs.stringify(data))
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });

}