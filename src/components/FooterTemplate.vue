<template>
    <van-tabbar v-model="active"
                v-if="$route.meta.showFooter"
                class="active_tab"
                safe-area-inset-bottom>
        <van-tabbar-item v-for="(item,index) in tabbars"
                         :key="index"
                         :info="item.info"
                         @click="tab(index,item.url)">
            <span style="float: bottom">{{item.tag}}</span>
            <van-icon class="iconfont"
                      size=".6rem"
                      class-prefix='icon' slot="icon"
                      slot-scope="props"
                      :name='props.active ? item.active:item.normal'>
            </van-icon>
        </van-tabbar-item>
    </van-tabbar>
</template>

<script>
    export default {
        name: "FooterTemplate",
        data() {
            return {
                active: 0,
                currentIndex: 0,
                messageInfo: "99+",
                addressBookInfo: "5",
                tabbars: [
                    {
                        normal: "iconfont icondkw_xiaoxi",
                        active: "iconfont iconxiaoxi2",
                        info: "",
                        tag: "消息",
                        url: '/index/message',
                    },
                    {
                        normal: "iconfont iconlianxirenweixuanzhong",
                        active: "iconfont iconlianxirenxuanzhong",
                        info: "",
                        tag: "联系人",
                        url: '/index/friends',
                    },
                    {
                        normal: "iconfont iconxingxing3",
                        active: "iconfont iconxingxing2",
                        info: "",
                        tag: "设置",
                        url: '/index/setting',
                    }
                ]
            }
        },
        methods: {
            tab(index, url) {
                if (index !== this.currentIndex) {
                    this.$router.push(url);
                    this.currentIndex = index;
                }
            }
        },
    }
</script>

<style scoped>
    .active_tab {
        height: 1.75rem;
    }
</style>
