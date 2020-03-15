<template>
    <div>

        <HeaderTemplate :tag="tag"/>
        <MessageList/>
        <FooterTemplate/>
    </div>
</template>

<script>
    import FooterTemplate from "@/components/FooterTemplate";
    import HeaderTemplate from "@/components/HeaderTemplate";
    import MessageList from "@/views/message/MessageList";

    export default {
        name: "Message",
        components: {HeaderTemplate, FooterTemplate, MessageList},
        data() {
            return {
                tag: "消息",
            }
        },
        methods: {},

    }
</script>

<style scoped>

</style>