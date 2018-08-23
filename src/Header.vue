<template>
    <div id="header">
        <h1 class="title">{{ title }}</h1>
    </div>
</template>

<script>
export default {
    data () {
        return {
            title: "Minesweeper"
        }
    }
}
</script>

<style lang="scss">
#header {
    text-align: center;
}

.title {
    font-weight: bold;
    font-size: 2.5em;
    margin: 6px 0 10px 0;
}
</style>
