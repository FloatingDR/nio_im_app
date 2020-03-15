<template>
    <div>
        <div class="left-message-row" v-if="!isMe">
            <div class="avatar">
                <div class="avatar-name" data-toggle="tooltip" :title="name">
                    {{name}}
                </div>
                <div class="avatar-img">
                    <van-image
                            round
                            :width="headerSize"
                            :height="headerSize"
                            :src="headImg"
                            @click="goPersonalPage"/>
                </div>
            </div>
            <div class="message">
                <div class="left-direction"></div>
                <div class="left-message-content">
                    {{content}}
                </div>
            </div>
        </div>

        <div class="right-message-row" v-if="isMe">
            <div class="message">
                <div class="right-message-content">
                    {{content}}
                </div>
                <div class="right-direction"></div>
            </div>
            <div class="avatar">
                <div class="avatar-name">
                    <span data-toggle="tooltip" :title="name">{{name}}</span>
                </div>
                <div class="avatar-img">
                    <van-image
                            round
                            :width="headerSize"
                            :height="headerSize"
                            :src="headImg"
                            @click="goPersonalPage"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: "Bubble",
        props: {
            userId: Number,
            isMe: Boolean,
            headImg: String,
            name: String,
            content: String,
        },
        data() {
            return {
                headerSize: "1.2rem",
            }
        },
        methods: {
            ...mapActions(['SET_VIEWING_ID']),
            ...mapGetters(['getUserCache', 'getViewingId']),
            goPersonalPage() {
                this.SET_VIEWING_ID(this.userId);
                this.$router.push({path: "/personalPage"});
            }
        }
    }
</script>

<style scoped>
    .left-message-row {
        margin-left: .5rem;
        display: flex;
        flex-direction: row;
    }

    .right-message-row {
        margin-right: .5rem;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }

    .message {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .left-message-content {
        background: #ecddd0;
        border-radius: 5px;
        padding: .2rem;
        margin-top: .4rem;
        text-align: left;
        max-width: 5rem;
    }

    .right-message-content {
        background: #d1f1fe;
        border-radius: 5px;
        padding: .2rem;
        margin-top: .4rem;
        text-align: left;
        max-width: 5rem;
    }

    .left-direction {
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        pointer-events: none;
        border-color: rgba(213, 242, 239, 0);
        border-right-color: #ecddd0;
        border-width: 8px;
        margin-left: -.2rem;
        margin-top: .3rem;
    }

    .right-direction {
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        pointer-events: none;
        border-color: rgba(213, 242, 239, 0);
        border-left-color: #d1f1fe;
        border-width: 8px;
        margin-right: -.2rem;
        margin-top: .3px;
    }

    .avatar {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-top: 6px;
        min-width: 50px;
    }

    .clear-margin-padding {
        margin: 0px;
        padding: 0px;
    }

    .avatar-img {
        margin-top: .2rem;
    }

    .avatar-name {
        color: #a3a3a3;
        font-size: 6px;
        text-align: center;
        max-width: 100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
    }
</style>