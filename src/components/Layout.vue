<template>
    <div id="container">
        <router-view name="header">
        </router-view>
        <router-view name="main">
        </router-view>
        <router-view name="footer">
        </router-view>
    </div>
</template>

<script>
    export default {
        name: "Layout",
    }
</script>

<style scoped>
    #container {
        width: 100%;
        height: 100%;
    }

</style>
