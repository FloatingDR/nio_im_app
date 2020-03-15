<template>
    <van-pull-refresh class="pullDiv" v-model="isLoading" success-text="刷新成功"
                      @refresh="onRefresh">
        <van-list v-model="loading"
                  :finished="finished"
                  :finished-text="finishedText"
                  @load="onLoad">
            <van-search
                    style="width: 100%;border-radius: 1rem"
                    shape="round"
                    disabled
                    placeholder="搜索"
                    input-align="center"
                    @click="search()">
            </van-search>

            <!--  消息列表-->
            <van-cell class="van_cell" v-for="item in list" :key="item.index"
                      @click="toChatPage(item.id,item.type)">
                <van-swipe-cell :before-close="beforeClose">
                    <!--  message list-->
                    <van-image
                            style="float: left;margin-right:.5rem ;"
                            round
                            :width="width"
                            :height="height"
                            :src="item.img">
                        <template v-slot:loading>
                            <van-loading type="spinner" size="20"/>
                        </template>
                    </van-image>
                    <div>
                        <div style="display: block">
                            <span>{{item.tag}}</span>
                            <span style="float:right;margin-right: .4rem;color: #a3a3a3;font-size: .35rem">{{item.time}}</span>
                        </div>
                        <div>
                            <span style="color: #a3a3a3;font-size: .35rem">{{item.msg}}</span>
                            <div v-if="item.count>0 && !item.singed" style="float:right;width:.4rem;height:.4rem;border-radius:.2rem;
                            background-color: crimson;line-height: .4rem;color: white;text-align: center;margin-right: .4rem">
                                {{item.count}}
                            </div>
                        </div>
                    </div>
                    <!--  左滑插槽-->
                    <template slot="right">
                        <van-button type="danger" @click="deleteMsg(item.index)">删除</van-button>
                    </template>
                </van-swipe-cell>
            </van-cell>
        </van-list>
        <!-- 用于填满空白 -->
        <div id="space_div"></div>
    </van-pull-refresh>
</template>

<script>
    import {mapActions} from "vuex";
    import USER from "@/api/user";
    import GROUP from "@/api/group";
    import MsgList from "@/data/MsgList";

    function isExist(arr, id, type) {
        for (let i = 0; i < arr.length; i++) {
            let da = arr[i];
            if (da.id === id && da.type === type) {
                return i;
            }
        }
        return -1;
    }

    export default {
        name: "MessageList",
        data() {
            return {
                count: 0,
                isLoading: false,
                successText: "刷新成功",
                loading: false,
                finished: false,
                finishedText: "没有更多了",
                itemLoading: true,
                width: "1.2rem",
                height: "1.2rem",
                list: [
                    // {
                    //     singed:false,
                    // }
                ],

            }
        },
        methods: {
            ...mapActions(['SET_CHATTING']),

            /**
             * 加载数据，并给list添加index，排序等操作
             */
            loadList() {
                let that = this;
                let arr = MsgList.get();
                let target = [];
                if (arr && arr.length > 0) {
                    for (let i = 0; i < arr.length; i++) {
                        let data = arr[i];
                        data.count = 1;
                        let indexOfEx = isExist(target, data.id, data.type);
                        if (indexOfEx >= 0) {
                            if (!data.singed || !target[indexOfEx].singed) {
                                data.count++;
                                target[indexOfEx].count++;
                            }
                            let tar = new Date(target[indexOfEx].time);
                            let da = new Date(data.time);
                            if (tar < da) {
                                target[indexOfEx] = data;
                            }
                            continue;
                        }
                        target.push(data);
                    }
                }

                // 更新缓存，剔除旧数据
                MsgList.update(target);

                // 拷贝的 target 数据，用于显示，target 用于持久化
                let string = JSON.stringify(target);
                this.list = JSON.parse(string);

                let list = this.list;
                if (list && list.length > 0) {
                    for (let i = 0; i < list.length; i++) {
                        let data = list[i];
                        if (data.type === 'CHAT') {
                            USER.getUserById(data.id).then(function (resp) {
                                if (resp.data.status) {
                                    data.img = resp.data.data.imgReduce;
                                    data.tag = resp.data.data.nickname;
                                    that.format(list, i, data);
                                }
                            }).catch(err => console.log(err));
                        } else if (data.type === 'GROUP') {
                            GROUP.getGroupInfo(data.id).then(function (resp) {
                                if (resp.data.status) {
                                    data.img = resp.data.data.groupImg;
                                    data.tag = resp.data.data.nickname;
                                    that.format(list, i, data);
                                }
                            }).catch(err => console.log(err));
                        }
                    }

                    let length = list.length;
                    // 设置index
                    for (let i = 0; i < length; i++) {
                        list[i].index = i;
                        that.$set(that.list, i, list[i]);
                    }
                }
            },
            // 格式化数据用于显示
            format(list, index, data) {
                let now = new Date();
                let date = new Date(data.time);
                let timeStr = '';
                let min = Math.floor((now - date) / 1000 / 60);
                if (min < 1) {
                    timeStr = '刚刚';
                } else {
                    timeStr = min + '分钟前';
                }
                if (min >= 60) {
                    let hour = Math.floor((now - date) / 1000 / 60 / 60);
                    timeStr = hour + '小时前';
                    if (hour >= 24) {
                        let day = Math.floor((now - date) / 1000 / 60 / 60 / 24);
                        timeStr = day + '天前';
                        if (day > 30) {
                            let mounth = Math.floor((now - date) / 1000 / 60 / 60 / 24 / 30);
                            timeStr = mounth + '月前';
                        }
                    }
                }
                data.time = timeStr;
                this.$set(list, index, data);
            },
            // 下拉刷新，刷新查找未读消息
            onRefresh() {
                setTimeout(() => {
                    this.isLoading = false;
                    this.count++;
                    this.loadList();
                }, 1000);
            }
            ,
            onLoad() {
                // 异步更新数据
                setTimeout(() => {
                    // 加载状态结束
                    this.loading = false;
                    this.finished = true;
                    this.finishedText = "";
                }, 1000);
            }
            ,
            beforeClose({position, instance}) {
                if (position === 'right') {
                    instance.close();
                }
            }
            ,
            /**
             * 删除指定index的元素
             */
            deleteMsg(index) {
                console.log("将删除的元素:", index);
                let list = this.list;
                let id = list[index].id;
                let type = list[index].type;
                MsgList.deleteAll(id, type);
                list.splice(index, 1);
                // resize
                this.resize(list);
            }
            ,
            /**
             * 动态设置空白div高度
             * 每次更改 list 数组后，必须调用此方法重新计算space_div高度
             */
            resize(arr) {
                // 获取footer高度
                let footerHeight = (document.getElementsByClassName("active_tab"))[0].clientHeight;
                // 初始化spaceDiv高度
                let space = document.getElementById("space_div");
                space.style.height = footerHeight + 'px';
                let length = arr.length;
                // 消息列表小于10条，将空白div高度动态扩展
                if (length < 10) {
                    // 获取spaceDiv的高度
                    let spaceDivHeight = space.clientHeight;
                    console.log("space_div初始高度为" + spaceDivHeight);
                    // 获取cellHeight的高度
                    let cellHeight = 0;
                    if (document.getElementsByClassName("van_cell").length > 0) {
                        cellHeight = (document.getElementsByClassName("van_cell"))[0].clientHeight;
                        console.log("cel高度为" + cellHeight);
                        let height = (9 - length) * cellHeight + spaceDivHeight;
                        console.log("动态设置space_div高度为" + height);
                        space.style.height = height + 'px';
                    } else {
                        let height = document.getElementById("app").clientHeight;
                        space.style.height = height + 'px';
                    }

                }
            }
            ,
            /**
             * 点击跳转到聊天页面,
             * 传递参数：ID，type
             */
            toChatPage(id, type) {
                if (type === 'CHAT') {
                    this.$router.push({path: '/chat'});
                    this.SET_CHATTING({id: id, type: 'chat'});

                } else if (type === 'group') {
                    this.$router.push({path: '/GROUP'});
                    this.SET_CHATTING({id: id, type: 'group'});
                }
                this.readList(id);
            }
            ,
            /**
             * 跳转到搜索页
             */
            search() {
                this.$router.push({path: '/search'});
            },
            /**
             * 已读列表
             * @param id 对方id
             */
            readList(id) {
                let target = MsgList.get();
                for (let i = 0; i < target.length; i++) {
                    if (target[i].id === id) {
                        target[i].singed = true;
                    }
                }
                MsgList.update(target);
            }

        },
        created() {
            this.loadList();
        }
        ,
        mounted() {
            this.resize(this.list);
            // MsgList.deleteAll()
        },
        computed: {
            onActive() {
                return this.$websocket.state.eventList;
            }
        },
        watch: {
            onActive: function () {
                this.loadList();
            },
        }
    }
</script>

<style scoped>
    .pullDiv {
        width: 100%;
        float: left;
    }
</style>