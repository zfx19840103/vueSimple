import request from '@/utils/request'
import Cookie from 'js-cookie'
import qs from 'qs';



export function getData(data) {
    return new Promise((resolve, reject) => {
        request
            .get(`/2u34/mss`, qs.stringify(data), {
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

export function pullCode(data) {
    return new Promise((resolve, reject) => {
        request
            .get(`/`, {
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