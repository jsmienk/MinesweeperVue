<template>
    <div class="button-switch clear">
        <button class="button-switch-button first" :class="{ selected: firstSelected }" @click="selectFirst">{{ firstValue }}</button><button class="button-switch-button second" :class="{ selected: !firstSelected }" @click="selectSecond">{{ secondValue }}</button>
    </div>
</template>

<script>
export default {
    props: {
        firstValue: {
            default: "⛏", // or 🔍
            type: String
        },
        secondValue: {
            default:"🚩", // or 📌 or 📍
            type: String
        }
    },
    data () {
        return {
            firstSelected: true
        }
    },
    methods: {
        selectFirst () {
            this.firstSelected = true
            this.$emit('onSelected', this.firstSelected)
        },
        selectSecond () {
            this.firstSelected = false
            this.$emit('onSelected', this.firstSelected)
        }
    }
}
</script>

<style lang="scss">
.button-switch {
    margin: 0 auto;
    max-width: 400px;
}

.button-switch-button {
    float: left;
    border-radius: 0px;
    width: 50%;
    font-size: 1.1em;
}

.selected {
    background-color: #666;
}

.first {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

.second {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

.clear:after {
    clear: both;
    content: "";
    display: table;
}
</style>