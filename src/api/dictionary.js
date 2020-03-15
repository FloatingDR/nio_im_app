import {SERVER_BASE, http} from "@/api/config";

export default {
    getAreaList() {
        return http.get(SERVER_BASE + `/dictionary/getAreaList`);
    },
}