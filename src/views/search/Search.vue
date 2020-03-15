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


    </div>

</template>

<script>
    export default {
        name: "Search",
        data() {
            return {
                value: "",
            }
        },
        methods: {
            onSearch() {
                console.log(this.value);
            },
            onCancel() {
                this.$router.goBack();
            }
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

</style>