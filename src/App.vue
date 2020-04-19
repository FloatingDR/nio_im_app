<template>
    <div id="app">
        <transition :name="transitionName">
            <router-view class="Router"/>
        </transition>
    </div>
</template>

<script>
    import CACHE from '@/api/cache';

    export default {
        data() {
            return {
                transitionName: 'slide-right'  // 默认动态路由变化为slide-right
            }
        },
        methods: {
            processData(data) {
                let type = data.header.msgType;
                let that = this;

                if (type === "LOGIN") {
                    return;
                } else if (type === 'CHAT') {
                    let msg = {
                        userId: data.sendId,
                        isMe: false,
                        headImg: '',
                        singed: false,
                        content: data.data,
                    };
                    // 保存到自己的缓存中， myId和sendId要交换
                    CACHE.cacheMsg(CACHE.getMyId(), data.sendId, 'CHAT', msg).then(function (resp) {
                        if (resp.data.status) {
                            console.log("已将获取到的消息存入缓存", data);
                            that.$websocket.state.chatList.push(data);
                        }
                    }).catch(err => console.log(err));
                } else if (type === 'GROUP') {
                    console.log(data);

                }
            },
            initWS() {
                this.$websocket.dispatch('WS_INIT');
            }
        },
        mounted() {
            this.initWS();
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
