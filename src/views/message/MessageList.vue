<template>
    <van-pull-refresh class="pullDiv" v-model="isLoading" success-text="刷新成功"
                      @refresh="onRefresh">
        <van-list v-model="loading"
                  :finished="finished"
                  :finished-text="finishedText"
                  @load="onLoad">

            <SearchTemplate/>

            <!--  消息列表-->
            <van-cell class="van_cell" v-for="item in list" :key="item.index"
                      @click="toChatPage(item.sendId,item.type)">
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
                            <!--                            <span style="color: #a3a3a3;font-size: .35rem">{{item.msg}}</span>-->
                            <div v-if="item.count > 0 " style="float:right;width:.5rem;height:.5rem;border-radius:.25rem;
                            background-color: crimson;line-height: .5rem;color: white;text-align: center;margin-right: .4rem;
                            font-size: .1rem">
                                {{item.count}}
                            </div>
                        </div>
                    </div>
                    <!--  左滑插槽-->
                    <template slot="right">
                        <van-button type="danger" @click="deleteMsg(item.index)">清空聊天记录</van-button>
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
    import MESSAGE from "@/api/Message";
    import CACHE from "@/api/cache";
    import SearchTemplate from "@/components/SearchTemplate";
    import USER from "@/api/user";

    export default {
        name: "MessageList",
        components: {SearchTemplate},
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
                    //     sendId,
                    //     img,
                    //     tag,
                    //     type,
                    //     count,
                    //     msg,
                    //     index
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
                let MyId = CACHE.getMyId();
                MESSAGE.getUnreadList(MyId).then(function (resp) {
                    if (resp.data.status) {
                        let cache = resp.data.data;
                        // 更新缓存
                        for (let i = 0; i < cache.length; i++) {
                            let msg = {
                                index: i,
                                sendId: cache[i].sendId,
                                img: cache[i].sendHeaderImg,
                                tag: cache[i].sendHeaderNickname,
                                count: cache[i].count,
                                type: 'CHAT',
                                time: cache[i].time,
                                msg: JSON.parse(cache[i].message).data,
                            };
                            that.format(that.list, i, msg);
                            that.update(that.list, i);
                        }
                    }
                }).catch(err => console.log(err));
            },
            // 更新用户名/头像
            update(list, index) {
                let that = this;
                USER.getUserById(list[index].sendId).then(function (resp) {
                    if (resp.data.status) {
                        list[index].img = resp.data.data.imgReduce;
                        that.$set(list, index, list[index]);
                    }
                }).catch((err) => {
                    console.log(err);
                });
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
                let id = CACHE.getMyId();
                let sendId = this.list[index].sendId;
                let type = this.list[index].type;
                // MsgList.deleteAll(id, type);
                // list.splice(index, 1);
                CACHE.deleteCache(id, sendId, type);
                // resize
                this.resize(this.list);
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
                        let height = (document.getElementById("app").clientHeight / 10) * 7;
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
                this.readList(id, type);
            },
            /**
             * 已读列表
             * @param id 对方id
             * @param type 消息类型
             */
            readList(id, type) {
                let myId = CACHE.getMyId();
                MESSAGE.read_batch_by_sendIdAndType(myId, id, type).then(function (resp) {
                    if (resp.data.status) {
                        console.log(resp.data.message);
                    }
                }).catch(err => console.log(err));
            }

        },
        created() {
            this.loadList();
        }
        ,
        mounted() {
            this.resize(this.list);
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
        margin: 0;
        padding: 0;
        width: 100%;
        height: 17.9rem;
        overflow: scroll;
        float: left;
    }
</style>
