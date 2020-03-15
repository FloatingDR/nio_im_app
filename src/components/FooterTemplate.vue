<template>
    <van-tabbar v-model="active"
                v-if="$route.meta.showFooter"
                class="active_tab"
                safe-area-inset-bottom>
        <van-tabbar-item v-for="(item,index) in tabbars"
                         :key="index"
                         :icon="item.icon"
                         :info="item.info">{{item.tag}}
        </van-tabbar-item>
    </van-tabbar>
</template>

<script>
    export default {
        name: "FooterTemplate",
        data() {
            return {
                active: 0,
                messageInfo: "99+",
                addressBookInfo: "5",
                tabbars: [
                    {
                        icon: "wechat",
                        info: "",
                        tag: "消息",
                    },
                    {
                        icon: "friends",
                        info: "",
                        tag: "联系人",
                    },
                    {
                        icon: "setting-o",
                        info: "",
                        tag: "动态",
                    }
                ]
            }
        }
    }
</script>

<style scoped>
    .active_tab {
        height: 1.75rem;
    }
</style>