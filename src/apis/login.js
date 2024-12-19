import request from '../utils/request'

export function loginuser(userlogin={}){
    return request({
        method: 'POST',
        url: '/user/login',
        data:userlogin
    })
}
