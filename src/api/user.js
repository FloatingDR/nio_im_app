import {SERVER_BASE, http} from "@/api/config";

export default {
    // 根据id获取用户信息
    getUserById(userId) {
        return http.get(SERVER_BASE + `/user/getById/${userId}`);
    },
    // 更新用户信息
    updateUserInfo(userId, user) {
        return http.put(SERVER_BASE + `/user/update/${userId}`, user);
    },
}
