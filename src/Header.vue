<template>
    <div id="header">
        <h1 class="title">{{ title }}</h1>
        <div class="options">
            Size <input class="number-input" :placeholder="fieldSizeDefault" @input="onFieldSizeChanged" v-model.number="fieldSize" type="number" /> <button @click="startNewGame">New game</button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            title: "Minesweeper",
            fieldSizeDefault: 10,
            fieldSize: 10
        }
    },
    methods: {
        startNewGame() {
            this.$emit('onStartNewGame')
        },
        onFieldSizeChanged(size) {
            this.$emit('onFieldSizeChanged', this.fieldSize)
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

.number-input {
    border: 1px solid #eee;
    padding: 4px 10px;
    border-radius: 2px;
    width: 80px;
    margin: 0 12px;
}
</style>
