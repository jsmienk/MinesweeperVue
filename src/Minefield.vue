<template>
    <div id="game">
        <h2 class="game-state">{{ gameStateText }}</h2>
        <p>{{ bombStateText }}</p>
        <div id="minefield" oncontextmenu="return false;">
            <div class="row" v-for="row in minefield" :key="row.x">
                <minesweeper-field-cell v-for="cell in row" :key="cell.y" :cellData="cell" @onCellClicked="onCellClicked" @onCellFlagged="onCellFlagged"></minesweeper-field-cell>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        fieldSize: Number,
        mineModeEnabled: Boolean
    },
    data() {
        return {
            minefield: [[{
                x: 0,
                y: 0,
                isBomb: false,
                isRevealed: false,
                isMarked: false,
                proximityCount: 0
            }]],
            bombList: [],
            amountOfCellsMarked: 0,
            size: 0,
            gameOver: false,
            gameStateText: ""
        }
    },
    created() {
        this.createField()
    },
    computed: {
        bombStateText() {
            return this.amountOfCellsMarked + " ❗ / " + this.bombList.length + " 💣"
        }
    },
    methods: {
        createField() {
            // Reset variables
            this.gameOver = false
            this.minefield.splice(0)
            this.bombList.splice(0)
            this.amountOfCellsMarked = 0

            // Change the game state text to wish the player good luck
            this.gameStateText = "Good luck! 🍀"

            // Save the current field size
            this.size = this.fieldSize

            console.log("Creating field (" + this.size + " x " + this.size + ") ...")
            
            const amountOfCells = this.size * this.size
            // Determine the amount of bombs
            const amountOfBombs = Math.round(amountOfCells * .15)
            
            console.log(amountOfBombs + " / " + amountOfCells + " cells will be bombs.")

            // Linaer list of all coords
            var coords = []

            // Fill the minefield
            for (var x = 0; x < this.size; x++) {
                this.$set(this.minefield, x, [])
                for (var y = 0; y < this.size; y++) {
                    // Save the coords in a linear array
                    coords[x * this.size + y] = {x: x, y: y}

                    // Create a data tile for every coord
                    this.$set(this.minefield[x], y, {
                        x: x,
                        y: y,
                        isBomb: false,
                        isRevealed: false,
                        isMarked: false,
                        proximityCount: 0
                    })
                }
            }

            // Shuffle the coords array so we can pick random unique bomb locations
            shuffle(coords)
            
            // Place the set amount of bombs in random unique locations
            var amountOfBombLeftToPlace = amountOfBombs
            // Keep track of the placed bombs
            while (amountOfBombLeftToPlace > 0) {
                // Get a unique random coord
                const selectedCoord = coords.pop()
                // Get the tile data
                let bombCell = this.minefield[selectedCoord.x][selectedCoord.y]
                // Set it to a bomb
                bombCell.isBomb = true
                // Keep track of it
                this.bombList.push(bombCell)
                // One bomb less to place
                amountOfBombLeftToPlace--
            }

            // Calculate the proximity for all tiles around a bomb
            for (var b = 0; b < this.bombList.length; b++) {
                const bombCell = this.bombList[b]
                this.doForAdjecentCells(bombCell, function(adjecentCell) {
                    // Increase its proximity count by 1
                    adjecentCell.proximityCount++
                })
            }
        },
        onCellClicked(coord) {
            if (this.mineModeEnabled) {
                this.onCellMined(coord)
            } else {
                this.onCellFlagged(coord)
            }
        },
        onCellMined(coord) {
            let cell = this.getCellByCoord(coord)
            if (!this.gameOver && cell !== undefined) {
                if (cell.isMarked) {
                    return console.log("Can't mine marked tile: " + coord.x + ", " + coord.y)
                }
                console.log("Mining: " + coord.x + ", " + coord.y + "...")
                cell.isRevealed = true

                // If it is a bomb
                if (cell.isBomb) {
                    // Game over
                    this.setGameOver()
                    return
                }

                // If it is an empty cell, clear all adjecent cells
                if (cell.proximityCount == 0) {
                    this.gameStateText = "Nice!"
                    const vm = this
                    const closure = function(adjecentCell) {
                        if (!adjecentCell.isRevealed) {
                            // If marked, remove the mark
                            if (adjecentCell.isMarked) {
                                adjecentCell.isMarked = false
                                vm.amountOfCellsMarked--
                            }
                            // Reveal the tile
                            adjecentCell.isRevealed = true
                            // Repeat for that cell if it is also a blank
                            if (adjecentCell.proximityCount == 0) {
                                vm.doForAdjecentCells(adjecentCell, closure)
                            }
                        }
                    }
                    vm.doForAdjecentCells(cell, closure)
                }

                // Compliment on close call
                if (cell.proximityCount > 2) {
                    this.gameStateText = "Close one!"
                }
            }
        },
        onCellFlagged(coord) {
            let cell = this.getCellByCoord(coord)
            if (!this.gameOver && cell !== undefined) {
                if (cell.isRevealed) {
                    return console.log("Can't flag revealed tile: " + coord.x + ", " + coord.y)
                }
                console.log("(Un)Flagging: " + coord.x + ", " + coord.y + "...")
                cell.isMarked = !cell.isMarked
                this.amountOfCellsMarked += (cell.isMarked ? 1 : -1)

                // Check if all bombs are marked
                var allBombsMarked = true
                for (var b = 0; b < this.bombList.length; b++) {
                    if (!this.bombList[b].isMarked) {
                        allBombsMarked = false
                        break
                    }
                }
                // All bombs are marked? No more markings than bombs?
                if (this.bombList.length == this.amountOfCellsMarked && allBombsMarked) {
                    // Winner!
                    this.setGameWon()
                }
            }
        },
        // helper method
        getCellByCoord(coord) {
            let cell = this.minefield[coord.x][coord.y]
            if (cell === undefined) {
                console.log("Clicked invalid cell!")
            }
            return cell;
        },
        // helper method
        doForAdjecentCells(middleCell, closure) {
            for (var i = -1; i < 2; i++) {
                for (var j = -1; j < 2; j++) {
                    // Calculate adjecent cell coords
                    const adjecentX = middleCell.x + i
                    const adjecentY = middleCell.y + j

                    // Check if the cell it within the field's borders
                    if (adjecentX >= 0 && adjecentX < this.size
                        && adjecentY >= 0 && adjecentY < this.size) {
                            // Execute whatever it wants
                            closure(this.minefield[adjecentX][adjecentY])
                    }
                }
            }
        },
        // Lose the game when a bomb is clicked
        setGameOver() {
            this.gameOver = true
            // Reveal all bombs
            for (var b = 0; b < this.bombList.length; b++) {
                this.bombList[b].isRevealed = true
            }

            this.gameStateText = "Game over! 💥"
        },
        setGameWon() {
            this.gameOver = true
            // Reveal all cells
             for (var x = 0; x < this.size; x++) {
                for (var y = 0; y < this.size; y++) {
                    let cell = this.minefield[x][y]
                    cell.isRevealed = cell.isBomb ? false : true
                }
            }
            this.gameStateText = "You won! 🎈"
        }
    }
}

// HELPER METHODS

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
</script>

<style lang="scss">
#game {
    text-align: center;
}

p {
    margin: 0;
    font-size: .9em;
}

.game-state {
    margin: 10px 0 0 0;
}

#minefield {
    max-width: calc(100vh * .4);
    margin: 6px auto 18px auto;
}

.row {
    display: table;
    width: 100%;
    padding: 0;
    margin: 0;
}
</style>
