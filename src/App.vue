<template>
    <div id="app">
        <transition :name="transitionName">
            <router-view class="Router"/>
        </transition>
    </div>
</template>

<script>
    import MessageData from "@/data/MessageData";
    import MsgList from "@/data/MsgList";

    export default {
        data() {
            return {
                transitionName: 'slide-right'  // 默认动态路由变化为slide-right
            }
        },
        methods: {
            processData(data) {
                let type = data.header.msgType;
                // 登录便会返回该用户的未读消息，一般为一个数组
                if (type === "LOGIN") {
                    let arr = JSON.parse(data.data);
                    for (let i = 0; i < arr.length; i++) {
                        let d = JSON.parse(arr[i].data);
                        // MessageData.insert(d.sendId, d.msgType, d.data);

                        let item = {
                            msgId: d.header.id,
                            id: d.sendId,
                            type: d.header.msgType,
                            time: d.sendTime,
                            msg: d.data,
                            singed: false,
                        };
                        MsgList.insert(item);
                    }
                    return;
                } else if (type === 'CHAT') {
                    MessageData.insert(data.sendId, type, data);
                    console.log(MessageData.get(data.sendId, data.msgType,));
                } else if (type === 'GROUP') {
                    MessageData.insert(data.sendId, type, data);
                }
                let item = {
                    msgId: data.header.id,
                    id: data.sendId,
                    type: data.header.msgType,
                    time: data.sendTime,
                    msg: data.data,
                };
                MsgList.insert(item);
            }
        },
        mounted() {
            this.$websocket.dispatch('WS_INIT', "ws://localhost:8081/websocket")
        },
        computed: {
            setEvent() {
                return this.$websocket.getters.onEvent('RECEIVED_DATA');
            }
        },
        watch: {
            setEvent(a, b) {
                if (a !== b && a) {
                    this.processData(a);

                }
            },
            // eslint-disable-next-line no-unused-vars
            '$route'(to, from) {
                let isBack = this.$router.isBack; //  监听路由变化时的状态为前进还是后退
                if (isBack) {
                    this.transitionName = 'slide-right'
                } else {
                    this.transitionName = 'slide-left'
                }
                this.$router.isBack = false
            }
        },

    }
</script>

<style>
    html, body {
        height: 100%;
        margin: 0;
        padding: 0;
        text-align: center;
        background-color: #ffffff;
    }

    #app {
        margin: 0;
        padding: 0;
        height: 100%;
    }

    .Router {
        position: absolute;
        width: 100%;
        transition: all .4s ease;

    }

    .slide-left-enter,
    .slide-right-leave-active {
        opacity: 0;
        -webkit-transform: translate(100%, 0);
        transform: translate(100%, 0);
    }

    .slide-left-leave-active,
    .slide-right-enter {
        opacity: 0;
        -webkit-transform: translate(-100%, 0);
        transform: translate(-100% 0);
    }


</style>
