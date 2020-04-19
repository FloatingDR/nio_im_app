<template>
    <div style="background-color: #ebebeb;height: 100%">
        <van-cell-group style="margin-top: .3rem;width: 100%">
            <van-cell title="切换账号" @click="changeAccount"></van-cell>
            <van-cell title="退出登录" @click="tryLoginOut"></van-cell>
            <van-popup style="height: 5rem" v-model="show" position="bottom">
                <van-cell-group style="margin-top: 1rem">
                    <van-cell style="color: #19c5ff" title="取消" size="large" @click="cancel"/>
                    <van-cell style="color: red" title="退出登录" size="large" @click="loginOut"/>
                </van-cell-group>
            </van-popup>
        </van-cell-group>
    </div>
</template>

<script>
    import {mapActions} from "vuex";

    export default {
        name: "Setting",
        data() {
            return {
                show: false
            }
        },
        methods: {
            ...mapActions(['LogoutAction', 'SetLoginOutState']),
            tryLoginOut() {
                this.show = true;
            },
            loginOut() {
                this.LogoutAction();
                this.$router.push({
                    path: '/'
                })
            },
            changeAccount() {
                this.SetLoginOutState();
                this.$router.push({
                    path: '/',
                    query: {showBack: true}
                });
            },
            cancel() {
                this.show = false;
            }
        }
    }
</script>

<style scoped>

</style>
