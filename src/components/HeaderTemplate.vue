<template>
    <van-sticky style="margin: 0;padding: 0;">
        <template>
            <div class="container">
                <div style="height: .8rem"></div>
                <van-row class="van_row">
                    <van-col span="5">
                        <van-image v-if="$route.meta.showHeaderImg"
                                   round
                                   :width="width"
                                   :height="height"
                                   :src="userImg"
                                   @click="toPersonalPage">
                        </van-image>
                        <van-icon v-if="$route.meta.goBack||showBack" name="arrow-left" :size="searchSize"
                                  @click="goBack"/>
                    </van-col>
                    <van-col span="14">
                        <span class="tag">{{$route.meta.tag||tag}}</span>
                    </van-col>
                    <van-col span="5">
                        <van-icon v-if="$route.meta.showMore" name="plus" :size="searchSize" @click="more"/>
                        <van-icon v-if="$route.meta.showListInfo" name="wap-nav" :size="searchSize" @click="listInfo"/>
                    </van-col>
                </van-row>
            </div>
        </template>
        <van-notice-bar v-if="NET_NOCONNECTION" left-icon="info-o" mode="closeable" style="width: 100%;margin: 0;">
            无网络连接
        </van-notice-bar>
    </van-sticky>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: "HeaderTemplate",
        props: {
            tag: String,
            showBack: Boolean,
        },
        data() {
            return {
                width: "1rem",
                height: "1rem",
                searchSize: ".5rem",
                userImg: "",
                NET_NOCONNECTION: false,
            }
        },
        methods: {
            ...mapActions(['SET_VIEWING_ID', 'SetLoginState']),
            ...mapGetters(['getUserCache', 'getMyId', 'getViewingId']),
            initData() {
                let cache = this.getUserCache();
                if (cache) {
                    this.userImg = cache.imgReduce;
                }
                this.NET_NOCONNECTION = !this.$websocket.state.wsConnected
            },
            // 点击头像，跳转到我的主页
            toPersonalPage() {
                this.$router.push({
                    path: "/personalPage",
                    query: {userId: this.getMyId()}
                });
                // 设置当前浏览的用户为自己
                this.SET_VIEWING_ID(this.getMyId());
            },
            more() {
                console.log("更多");
            },
            /**
             * 返回
             */
            goBack() {
                this.$router.goBack();
                this.SetLoginState();
            },
            /**
             * 聊天信息
             * 群聊显示群信息
             * 个人显示更多
             */
            listInfo() {

            }
        },
        created() {
            this.initData();
        },
        mounted() {

        },
        computed: {
            onNetError() {
                return this.$websocket.state.wsConnected;
            }
        },
        watch: {
            onNetError: function () {
                this.NET_NOCONNECTION = !this.$websocket.state.wsConnected
            },
        }
    }
</script>

<style scoped>
    .container {
        height: 2rem;
        line-height: 1rem;
        color: white;
    }

    .container {
        margin-bottom: 0;
        background: #05eeff linear-gradient(to right, rgba(0, 255, 0, 0), rgba(18, 149, 255, 0.5));
        transition: background-color .5s;
    }

    /*.container:hover {*/
    /*    background-color: purple;*/
    /*}*/

    .van_row {
        overflow: hidden;
    }

    .tag {
        font-size: .4rem;
    }
</style>
