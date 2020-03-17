import {request} from '@/api/request';
import {GetCache, CacheMsg, DeleteCache} from "@/api/urls";

export default {
    // 获取用户缓存消息
    getCache(userId, sendId, type) {
        return request({
            url: GetCache + `/${userId}/${sendId}/${type}`,
            method: 'GET',
        });
    },
    // 缓存用户消息
    cacheMsg(userId, sendId, type, msg) {
        return request({
            url: CacheMsg + `/${userId}/${sendId}/${type}`,
            method: 'POST',
            data: msg
        });
    },
    // 删除用户缓存消息
    deleteCache(userId, sendId, type) {
        return request({
            url: DeleteCache+`${userId}/${sendId}/${type}`,
            method: 'POST',
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

}