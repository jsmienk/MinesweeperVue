<template>
    <div id="game">
        <form class="options" @submit.prevent="prepareNewGame">
            Size <input class="number-input" :min="fieldSizeMin" :max="fieldSizeMax" :placeholder="fieldSizeDefault" v-model.number="fieldSize" type="number" /> <button>New game</button>
        </form>
        <h2 class="game-state">{{ gameStateText }}</h2>
        <p>{{ bombStateText }}</p>
        <minesweeper-field :minefield="minefield" @onCellLeftClicked="onCellClicked" @onCellRightClicked="onCellFlagged"></minesweeper-field>
        <app-button-switch id="mine-mode-switch" @onSelected="onModeChanged"></app-button-switch>
    </div>
</template>

<script>
export default {
    props: {
        bombIcon: {
            type: String,
            default: "💣"
        },
        flagIcon: {
            type: String,
            default: "❗" 
        },
        startText: {
            type: String,
            default: "Good luck! 🍀"
        },
        emptyCellText: {
            type: String,
            default: "Nice!" 
        },
        highProxCellText: {
            type: String,
            default: "Close one!"
        },
        winText: {
            type: String,
            default: "You won! 🎈"
        },
        loseText: {
            type: String,
            default: "Game over! 💥"
        }
    },
    data() {
        return {
            fieldSizeDefault: 10,
            fieldSizeMin: 5,
            fieldSizeMax: 50,
            fieldSize: 10,
            mineModeEnabled: true,
            minefield: [[{
                x: 0,
                y: 0,
                isBomb: false,
                isRevealed: false,
                isMarked: false,
                proximityCount: 0
            }]],
            firstClickHappened: false,
            bombList: [],
            amountOfCellsMarked: 0,
            amountOfBombs: 0,
            gameOver: false,
            gameStateText: "",
        }
    },
    created() {
        this.prepareNewGame()
    },
    computed: {
        bombStateText() {
            return this.amountOfCellsMarked + " " + this.flagIcon +  " / " + this.amountOfBombs + " " + this.bombIcon
        }
    },
    methods: {
        onModeChanged(isMineMode) {
            console.log("Mode: " + (isMineMode ? "Mine" : "Flag"))
            this.mineModeEnabled = isMineMode
        },
        prepareNewGame() {
            // Reset variables
            this.gameOver = false
            this.firstClickHappened = false
            this.minefield.splice(0)
            this.bombList.splice(0)
            this.amountOfCellsMarked = 0

            // Change the game state text to wish the player good luck
            this.gameStateText = this.startText

            // Save the current field size
            this.size = this.fieldSize
            
            const amountOfCells = this.size * this.size
            // Determine the amount of bombs
            this.amountOfBombs = Math.round(amountOfCells * .15)
            
            console.log(this.amountOfBombs + " / " + amountOfCells + " cells will be bombs.")

            // Create empty field
            for (let x = 0; x < this.size; x++) {
                this.$set(this.minefield, x, [])
                for (let y = 0; y < this.size; y++) {
                    // Create a data tile for every coord
                    this.$set(this.minefield[x], y,  {
                        x: x,
                        y: y,
                        isBomb: false,
                        isRevealed: false,
                        isMarked: false,
                        proximityCount: 0
                    })
                }
            }
        },
        placeMines(excludeCoord) {
            console.log("Creating field (" + this.size + " x " + this.size + ") ...")

            // Linaer list of all coords
            let coords = []

            // Fill the minefield
            for (let x = 0; x < this.size; x++) {
                for (let y = 0; y < this.size; y++) {
                    if (excludeCoord.x != x || excludeCoord.y != y) {
                        // Save the coords in a linear array
                        coords.push({x: x, y: y})
                    }
                }
            }

            // Shuffle the coords array so we can pick random unique bomb locations
            shuffle(coords)
            
            // Place the set amount of bombs in random unique locations
            let amountOfBombLeftToPlace = this.amountOfBombs
            // Keep track of the placed bombs
            while (amountOfBombLeftToPlace > 0 && coords.length > 0) {
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
            for (let b = 0; b < this.bombList.length; b++) {
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
            if (!this.firstClickHappened) {
                this.firstClickHappened = true
                this.placeMines(coord)
            }

            let cell = this.minefield[coord.x][coord.y]
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
                    this.gameStateText = this.emptyCellText
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
                    this.gameStateText = this.highProxCellText
                }
            }
        },
        onCellFlagged(coord) {
            let cell = this.minefield[coord.x][coord.y]
            if (!this.gameOver && cell !== undefined) {
                if (cell.isRevealed) {
                    return console.log("Can't flag revealed tile: " + coord.x + ", " + coord.y)
                }
                console.log("(Un)Flagging: " + coord.x + ", " + coord.y + "...")
                cell.isMarked = !cell.isMarked
                this.amountOfCellsMarked += (cell.isMarked ? 1 : -1)

                // Check if all bombs are marked
                let allBombsMarked = true
                for (let b = 0; b < this.bombList.length; b++) {
                    if (!this.bombList[b].isMarked) {
                        allBombsMarked = false
                        break
                    }
                }
                // All bombs are marked? No more markings than bombs?
                if (this.firstClickHappened && this.bombList.length == this.amountOfCellsMarked && allBombsMarked) {
                    // Winner!
                    this.setGameWon()
                }
            }
        },
        // helper method
        doForAdjecentCells(middleCell, closure) {
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
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
            for (let b = 0; b < this.bombList.length; b++) {
                this.bombList[b].isRevealed = true
            }

            this.gameStateText = this.loseText
        },
        setGameWon() {
            this.gameOver = true
            // Reveal all cells
             for (let x = 0; x < this.size; x++) {
                for (let y = 0; y < this.size; y++) {
                    let cell = this.minefield[x][y]
                    cell.isRevealed = cell.isBomb ? false : true
                }
            }
            this.gameStateText = this.winText
        }
    }
}

// HELPER METHODS

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

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

#minefield {
    position: absolute;
    top: 100px;
    width: calc(100%-16px);
    left: 8px;
    right: 8px;
    min-height: calc(100%-180px);
    height: calc(100%-180px);
    bottom: 50px;
}

#mine-mode-switch {
    position: absolute;
    bottom: 16px;
    left: 8px;
    right: 8px;
}

p {
    margin: 0;
    font-size: .9em;
}

.game-state {
    margin: 10px 0 0 0;
}

.number-input {
    border: 1px solid #eee;
    padding: 4px 10px;
    border-radius: 2px;
    width: 80px;
    margin: 0 12px;
}
</style>
