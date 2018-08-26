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
}

#header, #game, #footer {
  position: absolute;
}

#header {
  top: 0;
  width: 100%;
  height: 80px;
}

#game {
  top: 80px;
  width: 100%;
  min-height: calc(100%-200px);
  height: calc(100%-200px);
  bottom: 60px;
}

#footer {
  bottom: 0;
  height: 44px;
  width: 100%;
}
</style>
