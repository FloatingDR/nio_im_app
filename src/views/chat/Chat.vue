<template>
    <div class="container">
        <HeaderTemplate :tag="tag"/>
        <div id="scroller">
            <bubble v-for="item in messages" :key="item.msgId"
                    :user-id="item.userId" :is-me="item.isMe"
                    :head-img="item.headImg"
                    :content="item.content"
            />
        </div>
        <div class="space_div"></div>
        <van-row id="input_filed" v-if="ShowKeyInput">
            <van-col offset="1" span="17">
                <van-field style="border-radius: .6rem"
                           v-model="input"
                           name="input"
                           @keyup.enter.native="sendMsg"/>
            </van-col>
            <van-col span="6">
                <van-button color="#19c5ff" round type="info" @click="sendMsg">发送</van-button>
            </van-col>
        </van-row>
    </div>
</template>

<script>
    import HeaderTemplate from "@/components/HeaderTemplate";
    import {mapGetters} from "vuex";
    import Bubble from "@/views/chat/Bubble";
    import USER from "@/api/user";
    import CACHE from "@/api/cache"
    import MESSAGE from "@/api/Message";


    export default {
        name: "Chat",
        components: {Bubble, HeaderTemplate},
        data() {
            return {
                input: '',
                ShowKeyInput: false,
                item: {
                    show: true,
                    count: 'hello',
                },
                currentId: -1,
                type: "",
                tag: "聊天",
                myInfo: {
                    headImg: '',
                    userId: '',
                    nickname: '',
                },
                otherInfo: {
                    headImg: '',
                    userId: '',
                    nickname: '',
                },
                messages: [
                    // {
                    //     msgId: 1,
                    //     userId: 3520745329,
                    //     isMe: false,
                    //     headImg: '',
                    //     singed: fase,
                    //     content: '你好!你好!你好!你好!你好!你好!你好!你好!你好!你好!你好!你好!你好!你好!',
                    // }
                ]
            }
        },
        methods: {
            ...mapGetters(['getUserCache', 'getMyId', 'getChatting']),
            /**
             * 初始化页面数据
             */
            initData() {
                // 缓存当前浏览的id
                let chatting = this.getChatting();
                this.otherInfo.userId = chatting.id;
                let cache = this.getUserCache();
                this.myInfo.headImg = cache.imgReduce;
                this.myInfo.userId = cache.userId;
                this.myInfo.nickname = cache.nickname;

                let that = this;
                USER.getUserById(this.otherInfo.userId).then(function (resp) {
                    if (resp.data.status) {
                        let data = resp.data.data;
                        that.otherInfo.headImg = data.imgReduce;
                        that.otherInfo.userId = data.userId;
                        that.tag = data.nickname;
                        that.otherInfo.nickname = data.nickname;
                    }
                }).catch((err) => {
                    console.log(err);
                });

                CACHE.getCache(this.myInfo.userId, this.otherInfo.userId, 'CHAT').then(function (resp) {
                    if (resp.data.status) {
                        // console.log(resp.data.data);
                        // process
                        let arr = resp.data.data;
                        if (arr != null && arr.length > 0) {
                            for (let i = 0; i < arr.length; i++) {
                                that.processCache(that.messages, i, arr[i]);
                            }
                        }
                    }
                }).catch(err => console.log(err));

                this.readList(this.otherInfo.userId, 'CHAT');
            },
            // 处理缓存数据
            processCache(list, index, data) {
                if (data.userId === this.otherInfo.userId && data.userId !== this.myInfo.userId) {
                    data.headImg = this.otherInfo.headImg;
                } else {
                    data.headImg = this.myInfo.headImg;
                }
                this.$set(list, index, data);
            },
            sendMsg() {
                let myId = CACHE.getMyId();
                let receiveId = this.otherInfo.userId;
                let data = this.input;
                if (!data || data === '') {
                    return;
                }

                let msg = {
                    userId: myId,
                    isMe: true,
                    headImg: this.myInfo.headImg,
                    singed: false,
                    content: data,
                };
                this.messages.push(msg);
                CACHE.cacheMsg(myId, receiveId, 'CHAT', msg).then(function (resp) {
                    if (resp.data.status) {
                        console.log(resp.data.data);
                    }
                }).catch(err => console.log(err));

                let chat = {
                    header: {
                        msgType: "CHAT",
                        priority: 0
                    },
                    data: data,
                    sendTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
                    sendId: myId,
                    receiverId: receiveId,
                    signed: false
                };
                this.$websocket.state.websocket.send(JSON.stringify(chat));
                this.input = '';
            },
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
            this.initData();
        },
        mounted() {
            setTimeout(() => {
                this.ShowKeyInput = true;
            }, 500)
        },
        computed: {
            onActive() {
                return this.$websocket.state.chatList;
            },
        },
        watch: {
            onActive: function () {
                console.log("监听到新数据");
                this.initData();
            },
            // 设置滚动条拉到最底
            messages() {
                this.$nextTick(() => {
                    let list = this.$el.querySelector("#scroller");
                    list.scrollTop = list.scrollHeight;
                    console.log(list.scrollHeight);
                })
            }
        },
    }
</script>

<style scoped>
    .container {
        overflow: hidden;
    }

    .space_div {
        height: 2rem;
    }

    #scroller {
        overflow-y: scroll;
        overflow-x: hidden;
        height: 18rem;
    }

    #input_filed {
        height: 1.2rem;
        position: fixed;
        right: 0;
        bottom: 0;
        width: 100%;
        padding: .2rem;
        background-color: #ededed;
    }
</style>
