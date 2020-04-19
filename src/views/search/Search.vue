<template>
    <div class="container">
        <div class="space_div"/>
        <van-search
                v-model="value"
                shape="round"
                show-action
                placeholder="搜索"
                @search="onSearch"
                @cancel="onCancel"
        />
        <van-cell class="van_cell" v-for="item in list" :key="item.index"
                  @click="toPersonalPage(item.id)">
            <van-image
                    style="float: left;margin-right:.5rem ;"
                    round
                    :width="width"
                    :height="height"
                    :src="item.img"/>
            <div class="introduce">
                <span class="nickname">{{item.nickname}}</span>
                <span class="signature">{{item.signature}}</span>
            </div>
        </van-cell>
    </div>

</template>

<script>
    import USER from "@/api/user";
    import {mapActions} from "vuex";

    export default {
        name: "Search",
        data() {
            return {
                value: "",
                width: "1.2rem",
                height: "1.2rem",
                list: [],
            }
        },
        methods: {
            ...mapActions(['SET_VIEWING_ID']),
            onSearch() {
                let that = this;
                USER.getUserById(this.value).then(function (resp) {
                    if (resp.data.status) {
                        let data = resp.data.data;
                        that.setList(data, 0)
                    }
                }).catch(err => console.log(err));
            },
            onCancel() {
                this.$router.goBack();
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
                console.log(this.list)
            },
            toPersonalPage(id) {
                this.SET_VIEWING_ID(id);
                this.$router.push({path: "/personalPage"});
            },
        },
        mounted() {
        }
    }
</script>

<style scoped>
    .space_div {
        width: 100%;
        height: .8rem;
        margin-bottom: 0;
        background: #05eeff linear-gradient(to right, rgba(0, 255, 0, 0), rgba(18, 149, 255, 0.5));
        transition: background-color .5s;
    }

    .introduce {
        display: flex;
        flex-direction: column;
        color: #707070;
    }

</style>
