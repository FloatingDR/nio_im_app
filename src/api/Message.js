import {request} from "@/api/request";
import {GetUnreadList, Read_batch_by_sendIdAndType, ReadBatch} from "@/api/urls";

export default {
    // 标记userId的用户消息为已读消息
    readBatch(ids) {
        return request({
            url: ReadBatch,
            method: 'PUT',
            data: ids,
        });
    },
    // 标记userId/sendId/type的消息已读
    read_batch_by_sendIdAndType(userId, sendId, type) {
        return request({
            url: Read_batch_by_sendIdAndType + `/${userId}/${sendId}/${type}`,
            method: 'PUT',
        });
    },
    // 用户获取未读消息列表，用于生成未读列表
    getUnreadList(userId) {
        return request({
            url: GetUnreadList + `/${userId}`,
            method: 'GET'
        });
    }
}