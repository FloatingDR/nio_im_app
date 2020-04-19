<template>
    <div>
        <HeaderTemplate :tag="tag" :show-back="showBack"/>
        <div class="login">
            <van-image v-if="form.headerImg"
                       class="header"
                       round
                       width="2.5rem"
                       height="2.5rem"
                       :src="form.headerImg"/>
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="账号">
                    <el-input prefix-icon="el-icon-user" clearable v-model="form.userId"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input prefix-icon="el-icon-shopping-bag-2" clearable v-model="form.password"
                              show-password></el-input>
                </el-form-item>
            </el-form>
            <van-button icon="arrow" round color="linear-gradient(to right, #4bb0ff, #6149f6)"
                        @click="Login">登录
            </van-button>
        </div>
        <div class="register">
            <span @click="register">注册账号</span>
        </div>
    </div>
</template>

<script>
    import HeaderTemplate from "@/components/HeaderTemplate";
    import CACHE from "@/api/cache";
    import USER from "@/api/user";
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: "Login",
        components: {HeaderTemplate},
        data() {
            return {
                tag: '登录',
                showBack: false,
                form: {
                    headerImg: '',
                    userId: '',
                    password: ''
                }
            }
        },
        methods: {
            ...mapGetters(['getIsLoginEd']),
            ...mapActions(['LoginAction']),
            initData() {
                let cache = CACHE.getLoginCache();
                this.showBack = Boolean(this.$route.query.showBack);
                let that = this;
                if (cache !== null) {
                    this.form = cache;
                    console.log('getting login state', this.isLoginEd());
                    if (this.isLoginEd()) {
                        that.Login();
                    }
                }
            },
            Login() {
                let that = this;
                USER.login(this.form.userId, this.form.password).then(function (resp) {
                    if (resp.data.status) {
                        let info = resp.data.data;
                        if (info.birthday) {
                            info.birthday = info.birthday.split(" ")[0];
                        }
                        that.LoginAction(info);
                        that.form.headerImg = info.imgReduce;
                        CACHE.LoginCache(that.form);
                        that.$router.push({path: 'index/message'});
                    }
                }).catch(err => console.log(err))
            },
            register() {
                this.$router.push({path: 'register'})
            },
            isLoginEd() {
                return this.getIsLoginEd();
            }
        },
        created() {
            this.initData();
        }
    }
</script>

<style scoped>
    .login {
        margin: 2rem auto;
        width: 80%;
    }

    .header {
        margin-bottom: .7rem;
    }

    .register {
        margin: 3rem auto;
        color: #19c5ff;
    }
</style>
