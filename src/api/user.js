import {request} from '@/api/request';
import {GetUserById, UpdateUserInfo, Login, Register} from "@/api/urls";

export default {
    // 根据id获取用户信息
    getUserById(userId) {
        return request({
            url: GetUserById + `/${userId}`,
            method: 'GET',
        })
    },
    // 更新用户信息
    updateUserInfo(userId, user) {
        return request({
            url: UpdateUserInfo + `/${userId}`,
            method: 'PUT',
            data: user
        })
    },
    // 登录
    login(userId, password) {
        return request({
            url: Login,
            data: {
                userId: userId,
                password: password
            },
            method: 'POST'
        })
    },
    // 注册
    register(data) {
        return request({
            url: Register,
            data: data,
            method:'POST'
        })
    }

}
