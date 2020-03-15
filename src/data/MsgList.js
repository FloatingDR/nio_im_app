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
     * 获取数据 缓存key为 myId#MSG_LIST
     */
    get() {
        let string = localStorage.getItem(this.getMyId() + "#MSG_LIST");
        return JSON.parse(string);
    },
    /**
     * 更新
     * @param arr
     */
    update(arr) {
        let string = JSON.stringify(arr);
        localStorage.setItem(this.getMyId() + "#MSG_LIST", string);
    },
    /**
     * 插入数据(该操作仅限于数组)
     */
    insert(data) {
        // 最多存储500条
        let max = 100;
        let arr = this.get();
        if (arr === null) {
            arr = [];
        }
        while (arr.length >= max) {
            arr.pop();
        }
        arr.push(data);
        let string = JSON.stringify(arr);
        localStorage.setItem(this.getMyId() + "#MSG_LIST", string);
    },
    /**
     * 删除数据
     */
    deleteAll(id, type) {
        let target = [];
        let arr = this.get();
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id !== id && arr[i].type !== type) {
                target.push(arr[i]);
            }
        }
        let string = JSON.stringify(target);
        localStorage.setItem(this.getMyId() + "#MSG_LIST", string);
    },

    /**
     * 标为已读数据，用于消除红点
     * @param id
     * @param type
     */
    // readList(id, type) {
    //     let arr = this.get();
    //     for (let i = 0; i < arr.length; i++) {
    //         if (arr[i].id !== id && arr[i].type !== type) {
    //
    //         }
    //     }
    //     let string = JSON.stringify(target);
    //     localStorage.setItem(this.getMyId() + "#MSG_LIST", string);
    // }
}