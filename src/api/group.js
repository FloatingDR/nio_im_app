import {request} from "@/api/request";
import {GetGroupInfo} from "@/api/urls";

export default {
    // 根据id获取群组信息
    getGroupInfo(grounId) {
        return request({
            url: GetGroupInfo+`${grounId}`,
            method:'GET',
        });
    },
}