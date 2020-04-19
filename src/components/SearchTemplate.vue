<template>
    <van-search
            style="width: 100%;border-radius: 1rem"
            shape="round"
            disabled
            placeholder="搜索"
            input-align="center"
            @click="search()">
    </van-search>
</template>

<script>
    export default {
        name: "SearchTemplate",
        methods: {
            /**
             * 跳转到搜索页
             */
            search() {
                this.$router.push({path: '/search'});
            },
        }
    }
</script>

<style scoped>

</style>
