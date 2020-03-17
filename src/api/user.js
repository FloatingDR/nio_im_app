import {request} from '@/api/request';
import {GetUserById, UpdateUserInfo} from "@/api/urls";

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
    }

}
