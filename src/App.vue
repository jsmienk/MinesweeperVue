<template>
  <div id="app">
    <minesweeper-header @onStartNewGame="startNewGame" @onFieldSizeChanged="onFieldSizeChanged"></minesweeper-header>
    <minesweeper-field ref="minefield" :fieldSize="fieldSize" :mineModeEnabled="mineModeEnabled"></minesweeper-field>
    <minesweeper-footer @onModeChanged="onModeChanged"></minesweeper-footer>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      fieldSize: 10,
      mineModeEnabled: true
    }
  },
  methods: {
    onModeChanged(isMineMode) {
      console.log("Mode: " + (isMineMode ? "Mine" : "Flag"))
      this.mineModeEnabled = isMineMode
    },
    onFieldSizeChanged(size) {
      console.log("Field size: " + size)
      this.fieldSize = size
    },
    startNewGame() {
      this.$refs.minefield.createField()
    }
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
}

button {
  text-transform: uppercase;
  font-size: .7em;
  background-color: #333;
  color: #efefef;
  border: none;
  padding: 6px 10px;
  border-radius: 2px;
}

#app {
  font-family: 'M PLUS Rounded 1c', Arial, sans-serif;
  color: #333;
  padding: 8px;
  max-width: calc(100vh * .5);
  margin: 0 auto;
  overflow: hidden;
}
</style>
