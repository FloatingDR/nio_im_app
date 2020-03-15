<template>
    <div class="container">
        <header-template :tag="tag"/>

        <van-cell-group style="margin-top: .3rem">
            <van-cell class="text_cell" center title="昵称" v-if="info.nickname" :value="info.nickname" size="large"/>
            <van-cell class="text_cell" center title="性别" v-if="info.gender" :value="info.gender" size="large"/>
            <van-cell class="text_cell" center title="年龄" v-if="info.age" :value="info.age" size="large"/>
            <van-cell class="text_cell" center title="生日" v-if="info.birthday" :value="info.birthday" size="large"/>
            <van-cell class="text_cell" center title="星座" v-if="info.constellation" :value="info.constellation"
                      size="large"/>
            <van-cell class="text_cell" center title="属相" v-if="info.zodiac" :value="info.zodiac" size="large"/>
        </van-cell-group>

        <van-cell-group style="margin-top: .3rem">
            <van-cell class="text_cell" center title="职业" v-if="info.profession" :value="info.profession" size="large"/>
            <van-cell class="text_cell" center title="公司" v-if="info.company" :value="info.company" size="large"/>
            <van-cell class="text_cell" center title="所在地" v-if="info.address" :value="info.address" size="large"/>
            <van-cell class="text_cell" center title="故乡" v-if="info.hometown" :value="info.hometown" size="large"/>
        </van-cell-group>

        <div class="footer" v-if="showEdit">
            <van-button type="info" color="#27d5ff" class="edit" @click="edit">编辑资料</van-button>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import HeaderTemplate from "@/components/HeaderTemplate";
    import USER from "@/api/user";

    export default {
        name: "Info",
        components: {HeaderTemplate},
        data() {
            return {
                tag: "详细资料",
                currentId: 0,
                showEdit: false,
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
            }
        },
        methods: {
            ...mapActions(['LoginAction']),
            ...mapGetters(['getUserCache', 'getMyId', 'getViewingId']),
            initData() {
                // 当前浏览页面的用户id
                this.currentId = this.getViewingId();
                if (this.currentId === this.getMyId()) {
                    this.info = this.getUserCache();
                    this.showEdit = true;
                }
                // 浏览的不是自己的页面，获取数据
                else {
                    let that = this;
                    USER.getUserById(that.currentId).then(function (resp) {
                        if (resp.data.status) {
                            that.info = resp.data.data;
                            // 格式化生日
                            that.info.birthday = that.info.birthday.split(" ")[0];
                        }
                    }).catch((err) => console.log(err));
                }
            },
            goBack() {
                this.$router.goBack();
            },
            edit() {
                this.$router.push({path: "/editInfo"});
            }
        },
        created() {
            this.initData();
        },
        mounted() {

        }
    }
</script>

<style scoped>
    .container {
        height: 100%;
        width: 100%;
        background: #eeeeee;
    }

    .text_cell {
        text-align: left;
    }

    .footer {
        width: 100%;
        height: 1.75rem;
        position: fixed;
        left: 0;
        bottom: 0;
        background: white;
        line-height: 1.75rem;
    }

    .edit {
        width: 5rem;
    }
</style>