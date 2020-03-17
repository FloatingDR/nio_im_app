import {request} from '@/api/request';
import {GetAreaList} from "@/api/urls";

export default {
    getAreaList() {
        return request({
            url: GetAreaList,
            method: 'GET',
        });
    },
}