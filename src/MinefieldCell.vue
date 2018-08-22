<template>
    <div class="cell" :class="{ revealed: isRevealed }" @click="onCellClicked" @click.right="onCellRightClicked">
        <div class="content" v-show="isValueVisible">{{ value }}</div>
    </div>
</template>

<script>
export default {
    props: {
        cellData: Object
    },
    data() {
        return {}
    },
    methods: {
        onCellClicked() {
            this.$emit('onCellClicked', {x: this.cellData.x, y: this.cellData.y})
        },
        onCellRightClicked() {
            this.$emit('onCellFlagged', {x: this.cellData.x, y: this.cellData.y})
        }
    },
    computed: {
        value() {
            // Revealed can be a bomb or a number
            if (this.isRevealed) {
                if (this.cellData.isBomb) {
                    return "💣"
                } else {
                    return (this.cellData.proximityCount > 0 ? this.cellData.proximityCount : "")
                }
            }
            // Unrevealed is marked or empty
            return this.cellData.isMarked ? "❗" : ""
        },
        isValueVisible() {
            return this.isRevealed || this.cellData.isMarked
        },
        isRevealed() {
            return this.cellData.isRevealed
        }
    }
}
</script>

<style lang="scss">
.cell {
    // table-cell causes the cells to be of equal width in the row
    display: table-cell;
    position: relative;
    background-color: #eee;
    font-weight: bold;
    border: #ddd 1px solid;
}

// Equal the height to the cell's width
.cell:before{
	content: "";
	display: block;
	padding-top: 100%; 	/* initial ratio of 1:1*/
}

// Absolutely center the content in the cell
.content {
    position:  absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.revealed {
    background-color: #fff;
}
</style>
