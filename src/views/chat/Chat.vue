<template>
    <div class="container">
        <HeaderTemplate :tag="tag"/>
        <bubble v-for="item in messages" :key="item.msgId"
                :user-id="item.userId" :is-me="item.isMe"
                :head-img="item.headImg"
                :content="item.content"
        />
        <div class="space_div"></div>
        <van-row id="input_filed">
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
    import MessageData from "@/data/MessageData";
    import Message from "@/api/Message";


    export default {
        name: "Chat",
        components: {Bubble, HeaderTemplate},
        data() {
            return {
                input: '',
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
                },
                otherInfo: {
                    headImg: '',
                    userId: '',
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

                let that = this;
                USER.getUserById(this.otherInfo.userId).then(function (resp) {
                    if (resp.data.status) {
                        let data = resp.data.data;
                        that.otherInfo.headImg = data.imgReduce;
                        that.otherInfo.userId = data.userId;
                        that.tag = data.nickname;
                        // 初始化消息列表
                        that.initMessage();
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },

            /**
             * 处理消息
             */
            processMessage(obj, index) {
                if (obj.userId === this.myInfo.userId) {
                    obj.isMe = true;
                    obj.userId = this.myInfo.userId;
                    obj.headImg = this.myInfo.headImg;
                    this.$set(this.messages, index, obj)
                } else if (obj.userId === this.otherInfo.userId) {
                    obj.isMe = false;
                    obj.userId = this.otherInfo.userId;
                    obj.headImg = this.otherInfo.headImg;
                    this.$set(this.messages, index, obj)
                }
            },
            initMessage() {
                let data = MessageData.get(this.otherInfo.userId, 'CHAT');
                let begin = this.messages.length;
                if (data) {
                    for (let i = begin; i < data.length; i++) {
                        let header = data[i];
                        this.messages[i] = {
                            userId: data[i].sendId,
                            msgId: header.id,
                            content: data[i].data,
                            singed: data[i].singed,
                        };
                        this.processMessage(this.messages[i], i);
                    }
                }
                console.log(this.messages);
                this.readMessages();
            },
            readMessages() {
                // eslint-disable-next-line no-unused-vars
                let otherId = this.otherInfo.userId;
                // eslint-disable-next-line no-unused-vars
                let type = 'CHAT';
                let ids = [];
                for (let i = 0; i < this.messages.length; i++) {
                    if (!this.messages[i].singed && typeof this.messages[i].msgId !== "undefined") {
                        ids.push(this.messages[i].msgId);
                    }
                }
                if (ids && ids.length > 0) {
                    Message.readBatch(ids).then(function (resp) {
                        if (resp.data.status) {
                            // MessageData.batchRead(otherId, type, ids);
                            console.log(ids);
                            console.log("已读");
                        }
                    }).catch(err => console.log(err));
                }
            },
            sendMsg() {

                let data = this.input;
                if (!data || data === '') {
                    return;
                }

                let msg = {
                    userId: this.myInfo.userId,
                    isMe: true,
                    headImg: this.myInfo.headImg,
                    singed: false,
                    content: data,
                };
                let receiveId = this.otherInfo.userId;
                MessageData.insert(receiveId, 'CHAT', msg);
                this.messages.push(msg);

                // console.log("++++++", MessageData.get(receiveId, 'CHAT'));


                // let chat = {
                //     header: {
                //         msgType: "CHAT",
                //         priority: 0
                //     },
                //     data: data,
                //     sendTime: new Date(),
                //     sendId: MessageData.getMyId(),
                //     receiverId: receiveId,
                //     signed: false
                // };
                // this.$websocket.state.websocket.send(JSON.stringify(chat));
                this.input = '';
            }
        },
        created() {
            this.initData();
        },
        mounted() {
            // MessageData.deleteAll(this.otherInfo.userId, 'CHAT');
        },
        computed: {
            onActive() {
                return this.$websocket.state.eventList;
            }
        },
        watch: {
            onActive: function () {
                this.initData();
            },
        }
    }
</script>

<style scoped>
    .container {

    }

    .space_div {
        height: 2rem;
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