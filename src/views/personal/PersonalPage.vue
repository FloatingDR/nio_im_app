<template>
    <div class="container">
        <div id="top">
            <van-row class="zIndex">
                <van-col offset="1">
                    <van-icon name="arrow-left" size=".7rem" @click="back"/>
                </van-col>
            </van-row>

            <van-row style="margin-top: .7rem">
                <van-col offset="1">
                    <van-image
                            round
                            width="2.5rem"
                            height="2.5rem"
                            :src="info.imgReduce"
                            @click="previewHeader"/>
                </van-col>
            </van-row>

            <van-row style="margin-top: .7rem">
                <van-col style="font-size: .5rem" offset="1">{{info.nickname}}</van-col>
            </van-row>

            <van-row style="margin-top: .3rem">
                <van-col offset="1">
                    <van-tag v-for="(item,index) in tags" style="margin-right: .2rem"
                             round
                             :key="index" :color="item.color">{{item.tag}}
                    </van-tag>
                </van-col>
            </van-row>

            <van-row style="margin-top: .3rem" v-if="info.signature">
                <van-col style="text-align: left" offset="1">{{info.signature}}</van-col>
            </van-row>
        </div>

        <div class="down">
            <van-row style="margin-top: .4rem" v-if="info.userId">
                <van-col offset="1">
                    <span>账号：{{info.userId}}</span>
                </van-col>
            </van-row>
            <van-row style="margin-top: .4rem" v-if="info.profession">
                <van-col offset="1">
                    <span>职业：{{info.profession}}</span>
                </van-col>
            </van-row>
            <van-row style="margin-top: .4rem" v-if="info.company">
                <van-col offset="1">
                    <span>公司：{{info.company}}</span>
                </van-col>
            </van-row>
            <van-row style="margin-top: .4rem" v-if="info.address">
                <van-col offset="1">
                    <span>所在地：{{info.address}}</span>
                </van-col>
            </van-row>
            <van-row style="margin-top: .4rem">
                <van-col offset="1" style="color: #19c5ff;font-size: .35rem">
                    <span @click="listInfo">详细资料 > </span>
                </van-col>
            </van-row>
        </div>

        <div class="footer" v-if="showAddFriend">
            <van-button round size="normal" color="#19c5ff" type="info" style="width: 90%" @click="addFriend">加好友
            </van-button>
        </div>
    </div>
</template>

<script>
    import {ImagePreview} from 'vant';
    import {mapActions, mapGetters} from "vuex";
    import USER from "@/api/user";
    import FRIENDS from "@/api/friends";

    export default {
        name: "PersonalPage",
        data() {
            return {
                // 当前主页浏览的userId
                currentId: 0,
                type: "",
                color: ["#b9689e", "#73b2a5", "#0f8fb6", "#816bb2", "#8bbf89"],
                tags: [],
                info: {
                    "userId": -1,
                    "username": "",
                    "nickname": "",
                    "birthday": "",
                    "age": 0,
                    "gender": "",
                    "signature": "",
                    "profession": "",
                    "company": "",
                    "address": "",
                    "hometown": "",
                    "constellation": "",
                    "zodiac": "",
                    "imgReduce": "",
                    "img": "",
                    "backgroundImg": "",
                },
                showAddFriend: false,
            }
        },
        methods: {
            ...mapActions(['LoginAction']),
            ...mapGetters(['getUserCache', 'getMyId', 'getViewingId']),
            /**
             * 初始化页面数据
             */
            initData() {
                this.currentId = this.getViewingId();
                if (this.currentId === this.getMyId()) {
                    this.info = this.getUserCache();
                }
                // 浏览的不是自己的页面，获取数据
                else {
                    let that = this;
                    // 注意ajax异步调用，有可能导致数据加载不同步
                    // 数据处理代码块必须在ajax回调方法中再次调用
                    USER.getUserById(that.currentId).then(function (resp) {
                        if (resp.data.status) {
                            that.info = resp.data.data;
                            that.resize(that.info.backgroundImg);
                            that.setTags();
                        }
                    }).catch((err) => console.log(err));
                }
                this.resize(this.info.backgroundImg);
                this.setTags();
                this.checkIfMyFriends();
            },
            checkIfMyFriends() {
                let that = this;
                if (that.currentId === that.getMyId()) {
                    that.showAddFriend = false;
                    return;
                }
                FRIENDS.listMyFriends(that.getMyId()).then(function (resp) {
                    if (resp.data.status) {
                        let index = resp.data.data.map(T => {
                            return T.userId
                        }).indexOf(that.currentId);
                        if (index < 0) {
                            that.showAddFriend = true
                        }
                    }
                }).catch(err => console.log(err))
            },
            /**
             * 设置个性标签
             */
            setTags() {
                let tags = this.tags;
                let info = this.info;
                let index = 0;
                if (info.gender) {
                    tags.push({
                        tag: info.gender,
                        color: this.color[index]
                    });
                    index++;
                }
                if (info.age > 0) {
                    tags.push({
                        tag: info.age,
                        color: this.color[index]
                    });
                    index++;
                }
                if (info.constellation) {
                    tags.push({
                        tag: info.constellation,
                        color: this.color[index]
                    });
                    index++;
                }
                if (info.zodiac) {
                    tags.push({
                        tag: '属' + info.zodiac,
                        color: this.color[index]
                    });
                    index++;
                }
                if (info.address) {
                    tags.push({
                        tag: info.address.replace('省', '').split(" ")[0],
                        color: this.color[index]
                    });
                    index++;
                }

            },
            /**
             * 设置背景图及其大小
             */
            resize(backgroundImg) {
                let docEl = document.getElementById("top");
                let imgHeight = docEl.clientHeight;
                docEl.style.backgroundImage = "url(" + backgroundImg + ")";
                docEl.style.background = "url(" + backgroundImg + ") rgba(0, 0, 0, .5) no-repeat center center";
                docEl.style.backgroundSize = 1.8 * imgHeight + 'px';
            },

            /**
             * 修改信息
             */
            edit() {
                console.log("edit");
            },
            /**
             * 点击头像预览图片
             */
            previewHeader() {
                this.previewImg(this.info.img);
            },
            /**
             * 点击背景预览
             */
            previewBackground() {
                this.previewImg(this.info.img);
            },
            previewImg(img) {
                ImagePreview([img]);
            },
            back() {
                this.$router.goBack();
            },
            listInfo() {
                this.$router.push({
                    path: "/info",
                    query: {userId: this.currentId}
                });
            },
            addFriend() {
                let that = this;
                // console.log(this.getMyId(),this.currentId)
                FRIENDS.addFriends(this.getMyId(), this.currentId).then(function (resp) {
                    if (resp.data.status) {
                        that.$message({
                            message: '添加成功，快来和朋友一起聊天吧！',
                            type: 'success'
                        });
                    } else {
                        that.$message({
                            message: '添加失败！',
                            type: 'warning'
                        });
                    }
                }).catch(err => console.log(err));
            }

        },
        mounted() {
            this.initData();
        }
    }
</script>

<style scoped>
    .container {
        color: white;
        display: block;
    }

    #top {
        padding: .7rem 0 .7rem 0;
        background: rgba(0, 0, 0, .5);
        background-blend-mode: multiply;
        height: 7rem;
    }

    .down {
        font-size: .38rem;
        color: #707070;
        width: 100%;
        margin-top: .8rem;
    }

    .footer {
        width: 100%;
        position: fixed;
        bottom: 0;
        padding-bottom: .3rem;
        padding-top: .3rem;
    }
</style>
