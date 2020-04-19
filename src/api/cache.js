import {request} from '@/api/request';
import {GetCache,CacheMsg,DeleteCache} from "@/api/urls";

export default {
    // 获取用户缓存消息
    getCache(userId, sendId, type) {
        // return new Promise(function (resolve, reject) {
        //     let str = localStorage.getItem(userId + sendId + "#" + type);
        //     let arr = JSON.parse(str);
        //     resolve(arr);
        //     reject(err => console.log(err));
        // })
        return request({
            url: GetCache + `/${userId}/${sendId}/${type}`,
            method: 'GET',
        });
    },
    // 缓存用户消息
    cacheMsg(userId, sendId, type, msg) {
        // return new Promise(function (resolve, reject) {
        //     let str = JSON.stringify(arr);
        //     localStorage.setItem(userId + sendId + "#" + type, str);
        //     resolve(true);
        //     reject(err => console.log(err));
        // })
        return request({
            url: CacheMsg + `/${userId}/${sendId}/${type}`,
            method: 'POST',
            data: msg
        });
    },
    // 删除用户缓存消息
    deleteCache(userId, sendId, type) {
        return request({
            url: DeleteCache + `/${userId}/${sendId}/${type}`,
            method: 'DELETE',
        });
    },
    /**
     * 有可能本地多用户登录，缓存加前缀 myId
     * @returns {number}
     */
    getMyId() {
        let cache = localStorage.getItem("userCache");
        return Number.parseInt(JSON.parse(cache).userId);
    },
    /**
     * 缓存账号密码
     * @param form
     * @constructor
     */
    LoginCache(form) {
        let string = JSON.stringify(form);
        localStorage.setItem('loginCache', string);
    },
    /**
     * 获取账号密码
     * @returns {any}
     */
    getLoginCache() {
        let cache = localStorage.getItem("loginCache");
        return JSON.parse(cache);
    }

}
