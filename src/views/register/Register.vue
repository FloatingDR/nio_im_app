<template>
    <div class="container">
        <HeaderTemplate :tag="tag"/>
        <div style="margin-top: .5rem">
            <van-form>
                <van-field
                        v-model="nickname"
                        name="昵称"
                        label="昵称"
                        placeholder="请输入昵称"
                />
                <van-field
                        v-model="password"
                        name="密码"
                        label="密码"
                        type="password"
                        placeholder="请输入密码"
                />
                <van-field v-if="password"
                           v-model="rePassword"
                           name="确认密码"
                           label="确认密码"
                           type="password"
                           placeholder="请确认密码"
                           :rules="[{ validator, message: '请输入相同的密码' }]"
                />
            </van-form>
            <div style="margin: 16px;">
                <van-button color="#28b3ee" round block @click="registerAndLogin">
                    注册并登录
                </van-button>
            </div>
        </div>
    </div>
</template>

<script>
    import HeaderTemplate from "@/components/HeaderTemplate";
    import USER from "@/api/user";
    import CACHE from "@/api/cache";
    import {mapActions} from "vuex";

    export default {
        name: "Register",
        components: {HeaderTemplate},
        data() {
            return {
                tag: '注册',
                nickname: '',
                password: '',
                rePassword: '',
            }
        },
        methods: {
            ...mapActions(['LoginAction']),
            validator() {
                return this.password === this.rePassword
            },
            registerAndLogin() {
                let that = this;
                let data = {
                    nickname: that.nickname,
                    password: that.password
                };
                USER.register(data).then(function (resp) {
                    if (resp.data.status) {
                        let userId = resp.data.data;
                        that.login(userId, that.password);
                    }
                }).catch(err => console.log(err));
            },
            login(userId, password) {
                let that = this;
                USER.login(userId, password).then(function (resp) {
                    let info = resp.data.data;
                    if (info.birthday) {
                        info.birthday = info.birthday.split(" ")[0];
                    }
                    that.LoginAction(info);
                    let form = {
                        headerImg: info.imgReduce,
                        userId: userId,
                        password: password,
                    };
                    CACHE.LoginCache(form);
                    that.$router.push({path: 'index/message'});
                    that.$message({
                        message: '恭喜您，注册成功，快来和朋友一起聊天吧！',
                        type: 'success'
                    });
                }).catch(err => console.log(err))
            },
        },
    }
</script>

<style scoped>
    .container {
        width: 100%;
        height: 100%;
        background: #eeeeee;
    }
</style>
