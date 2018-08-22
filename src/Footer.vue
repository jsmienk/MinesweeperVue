<template>
    <div id="footer">
        <app-button-switch @onSelected="onModeChanged"></app-button-switch>
        <div id="credits">Made by Jeroen Smienk ❤</div>
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    methods: {
        onModeChanged(isMineMode) {
            // Propogate event upwards
            this.$emit('onModeChanged', isMineMode)
        }
    }
}
</script>

<style lang="scss">
#credits {
    padding: 12px 12px 0 12px;
    bottom: 0;
    text-align: center;
    font-size: .8em;
}
</style>