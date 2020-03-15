<template>
    <div/>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import USER from "@/api/user";

    export default {
        name: "Test",
        data() {
            return {}
        },
        methods: {
            ...mapActions(['LoginAction']),
            ...mapGetters(['getUserCache', 'getMyId', 'getViewingId']),
            login() {
                let that = this;
                USER.getUserById(3520745329).then(function (resp) {
                    if (resp.data.status) {
                        let info = resp.data.data;
                        info.birthday = info.birthday.split(" ")[0];
                        that.LoginAction(info);
                    }
                }).catch((err) => console.log(err));
            }
        },
        mounted() {
            this.login();
            let c = this.getUserCache();
            if (c) {
                this.$router.push("Message");
            }
        }
    }
</script>

<style scoped>

</style>