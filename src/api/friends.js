import {request} from '@/api/request';
import {AddFriends, ListCommonFriends, ListMyFriends, RemoveFriends} from "@/api/urls";

export default {
    // 添加朋友
    addFriends(userIdOne, userIdTwo) {
        return request({
            url: AddFriends + `/${userIdOne}/${userIdTwo}`,
            method: 'POST',
        })
    },
    // 移除朋友关系
    removeFriends(userIdOne, userIdTwo) {
        return request({
            url: RemoveFriends + `/${userIdOne}/${userIdTwo}`,
            method: 'DELETE',
        })
    },
    // 获取我的所有好友
    listMyFriends(userId) {
        return request({
            url: ListMyFriends + `/${userId}`,
            method: 'GET'
        })
    },
    // 获取两个用户的公共好友
    listCommonFriends(userId1, userId2) {
        return request({
            url: ListCommonFriends + `/${userId1}/${userId2}`,
            method: 'GET'
        })
    }
}
