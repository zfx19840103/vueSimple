import request from '@/utils/request'
import Cookie from 'js-cookie'
import qs from 'qs';
import API from './global';

export function logisticsinfo(data) {
    return new Promise((resolve, reject) => {
        request
            .get(`${API}/openapi/logistics/info?${qs.stringify(data)}`)
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });
    
}
