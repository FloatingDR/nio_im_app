import {request} from '@/api/request';
import {Upload, UploadFile} from "@/api/urls";

export default {
    // 原图+压缩图
    uploadFile(userId, file) {
        let params = new FormData();
        params.append('file', file.file);
        return request({
            url: UploadFile + `/${userId}`,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            method: 'POST',
            data: params,
        });
    },
    // 原图
    upload(userId, file) {
        let params = new FormData();
        params.append('file', file.file);
        return request({
            url: Upload+`/${userId}`,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            method: 'POST',
            data: params
        });
    }
}
