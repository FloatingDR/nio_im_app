export default {

    /**
     * 有可能本地多用户登录，缓存加前缀 myId
     * @returns {number}
     */
    getMyId() {
        let cache = localStorage.getItem("userCache");
        return Number.parseInt(JSON.parse(cache).userId);
    },

    /**
     * 获取数据 缓存key为 myId_otherId#type
     * @param otherId 对方id
     * @param type 消息类型，群聊或点对点
     */
    get(otherId, type) {
        let string = localStorage.getItem(this.getMyId() + "_" + otherId + "#" + type);
        return JSON.parse(string);
    },
    /**
     * 插入数据(该操作仅限于数组)
     * @param otherId 对方id
     * @param type 消息类型，群聊或点对点
     * @param data 要插入的数据
     */
    insert(otherId, type, data) {
        let arr = this.get(otherId, type);
        if (arr === null) {
            arr = [];
        }
        arr.push(data);
        let string = JSON.stringify(arr);
        localStorage.setItem(this.getMyId() + "_" + otherId + "#" + type, string);
    },
    /**
     * 删除数据
     * @param otherId 对方id
     * @param type 消息类型，群聊或点对点
     */
    deleteAll(otherId, type) {
        localStorage.removeItem(this.getMyId() + "_" + otherId + "#" + type);
    },

    batchRead(otherId, type, ids) {
        let arr = this.get(otherId, type);
        for (let i = 0; i < arr.length; i++) {
            // 已读
            if (ids.indexOf(arr[i].header.id) >= 0) {
                arr[i].singed = true;
            }
        }
        let string = JSON.stringify(arr);
        localStorage.setItem(this.getMyId() + "_" + otherId + "#" + type, string);
    },


    update(otherId, type, data) {
        let string = JSON.stringify(data);
        localStorage.setItem(this.getMyId() + "_" + otherId + "#" + type, string);
        console.log("............")
    }
}