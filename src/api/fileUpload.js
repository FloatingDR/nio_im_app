import {SERVER_BASE, http_file} from "@/api/config";

export default {
    // 原图+压缩图
    uploadFile(userId, file) {
        let params = new FormData();
        params.append('file', file.file);
        return http_file.post(SERVER_BASE + `/file/uploadHeaderImg/${userId}`, params);
    },
    // 原图
    upload(userId, file) {
        let params = new FormData();
        params.append('file', file.file);
        return http_file.post(SERVER_BASE + `/file/upload/${userId}`, params);
    }
}