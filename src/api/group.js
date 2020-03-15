import {SERVER_BASE, http} from "@/api/config";

export default {
    // 根据id获取群组信息
    getGroupInfo(grounId) {
        return http.get(SERVER_BASE + `/group/get_group/${grounId}`);
    },
}