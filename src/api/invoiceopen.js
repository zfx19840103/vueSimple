import request from '@/utils/request'
import Cookie from 'js-cookie'
import qs from 'qs';
import API from './global';

export function orderinvoice(data) {
    return new Promise((resolve, reject) => {
        request
            .post(`${API}/openapi/user/order/invoice`, qs.stringify(data))
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
    });
    
}
