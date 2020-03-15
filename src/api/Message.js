import {SERVER_BASE, http} from "@/api/config";

export default {
    // 标记userId的用户消息为已读消息
    readBatch(ids) {
        return http.put(SERVER_BASE + `/message/read_batch`, ids);
    },
}