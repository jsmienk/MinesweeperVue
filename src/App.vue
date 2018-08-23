<template>
  <div id="app">
    <minesweeper-header></minesweeper-header>
    <minesweeper-game></minesweeper-game>
    <minesweeper-footer></minesweeper-footer>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {}
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
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
}
</style>
