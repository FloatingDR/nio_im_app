<template>
    <div>
        <SearchTemplate/>
        <div style="background: #f3f3f3;width: 100%">
<!--            <van-cell title="新朋友" :value="newFriends" @click="gotoNewFriends" is-link/>-->
        </div>
        <div class="friend_list">
            <van-cell class="van_cell" v-for="item in list" :key="item.index"
                      >
                <!--  friends list-->
                <van-image
                        style="float: left;margin-right:.5rem ;"
                        round
                        :width="width"
                        :height="height"
                        :src="item.img"
                        @click="toPersonalPage(item.id)"/>
                <div class="introduce" @click="toChatPage(item.id)">
                    <span class="nickname">{{item.nickname}}</span>
                    <span class="signature">{{item.signature}}</span>
                </div>
            </van-cell>
            <div class="space_div" style="height: 1.75rem"></div>
        </div>
    </div>
</template>

<script>
    import SearchTemplate from "@/components/SearchTemplate";
    import {mapActions, mapGetters} from "vuex";
    import friends from "@/api/friends";

    export default {
        name: "Friends",
        components: {SearchTemplate},
        data() {
            return {
                width: "1.2rem",
                height: "1.2rem",
                newFriends: '1',
                list: [
                    // {
                    //     index: 0,
                    //     img: 'http://localhost:7070/3520745329_a20e4c527a2444c29b3ded9d1840ed9f.jpg',
                    //     nickname: 'Xelastic',
                    //     id: 3520745329,
                    //     signature: '没有伞的孩子只能努力奔跑',
                    // },
                ],
            }
        },
        methods: {
            ...mapActions(['SET_VIEWING_ID','SET_CHATTING']),
            ...mapGetters(['getMyId']),
            initData() {
                let myId = this.getMyId();
                let that = this;
                friends.listMyFriends(myId).then(function (resp) {
                    if (resp.data.status) {
                        let data = resp.data.data;
                        for (let i = 0; i < data.length; i++) {
                            that.setList(data[i], i)
                        }
                    }
                }).catch(err => console.log(err));
            },
            setList(respData, index) {
                let data = {
                    index: index,
                    img: respData.imgReduce,
                    nickname: respData.nickname,
                    id: respData.userId,
                    signature: respData.signature,
                };
                this.$set(this.list, index, data);
            },
            toPersonalPage(id) {
                this.SET_VIEWING_ID(id);
                this.$router.push({path: "/personalPage"});
            },
            toChatPage(id) {
                this.$router.push({path: '/chat'});
                this.SET_CHATTING({id: id, type: 'chat'});
            },
            gotoNewFriends() {

            }
        },
        mounted() {
            this.initData()
        }
    }
</script>

<style scoped>
    .friend_list {
        margin-top: .5rem;
        padding: 0;
        width: 100%;
        height: 17.9rem;
        overflow: scroll;
    }

    .introduce {
        display: flex;
        flex-direction: column;
        color: #707070;
    }

    .nickname {
    }

    .signature {
        font-size: .2rem;
    }
</style>
