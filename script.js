class TicTacToeGame {
  constructor() {
    this.board = Array(9).fill(null)
    this.currentPlayer = "X"
    this.winner = null
    this.gameMode = "pvp"
    this.score = { X: 0, O: 0, ties: 0 }
    this.winningCombination = null
    this.isAIThinking = false

    this.winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ]

    this.initializeGame()
  }

  initializeGame() {
    this.bindEvents()
    this.updateDisplay()
  }

  bindEvents() {
    // Cell clicks
    document.querySelectorAll(".cell").forEach((cell, index) => {
      cell.addEventListener("click", () => this.makeMove(index))
    })

    // Mode buttons
    document.getElementById("pvp-btn").addEventListener("click", () => this.switchGameMode("pvp"))
    document.getElementById("ai-btn").addEventListener("click", () => this.switchGameMode("ai"))

    // Control buttons
    document.getElementById("new-game-btn").addEventListener("click", () => this.resetGame())
    document.getElementById("reset-score-btn").addEventListener("click", () => this.resetScore())
  }

  makeMove(index) {
    if (this.board[index] || this.winner || this.isAIThinking) return

    this.board[index] = this.currentPlayer
    this.updateCellDisplay(index)

    const result = this.checkWinner()
    if (result.winner) {
      this.winner = result.winner
      this.winningCombination = result.winningCombination
      this.updateScore()
      this.showWinningLine()
    } else {
      this.currentPlayer = this.currentPlayer === "X" ? "O" : "X"
    }

    this.updateDisplay()

    // AI move
    if (this.gameMode === "ai" && this.currentPlayer === "O" && !this.winner) {
      this.makeAIMove()
    }
  }

  makeAIMove() {
    this.isAIThinking = true
    this.updateDisplay()

    setTimeout(() => {
      const availableMoves = this.board
        .map((cell, index) => (cell === null ? index : null))
        .filter((index) => index !== null)

      if (availableMoves.length === 0) return

      // Try to win
      let aiMove = this.findBestMove("O")

      // Try to block player
      if (aiMove === null) {
        aiMove = this.findBestMove("X")
      }

      // Strategic moves
      if (aiMove === null) {
        const preferredMoves = [4, 0, 2, 6, 8, 1, 3, 5, 7]
        aiMove = preferredMoves.find((move) => availableMoves.includes(move)) ?? availableMoves[0]
      }

      this.isAIThinking = false
      this.makeMove(aiMove)
    }, 500)
  }

  findBestMove(player) {
    const availableMoves = this.board
      .map((cell, index) => (cell === null ? index : null))
      .filter((index) => index !== null)

    for (const move of availableMoves) {
      const testBoard = [...this.board]
      testBoard[move] = player
      if (this.checkWinnerForBoard(testBoard).winner === player) {
        return move
      }
    }
    return null
  }

  checkWinner() {
    return this.checkWinnerForBoard(this.board)
  }

  checkWinnerForBoard(board) {
    // Check winning combinations
    for (const [a, b, c] of this.winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], winningCombination: [a, b, c] }
      }
    }

    // Check for tie
    if (board.every((cell) => cell !== null)) {
      return { winner: "tie", winningCombination: null }
    }

    return { winner: null, winningCombination: null }
  }

  updateCellDisplay(index) {
    const cell = document.querySelector(`[data-index="${index}"]`)
    const player = this.board[index]

    if (player === "X") {
      cell.innerHTML = `
                <svg viewBox="0 0 100 100" class="neon-x">
                    <path d="M20 20 L80 80 M80 20 L20 80" 
                          stroke="#60A5FA" 
                          stroke-width="8" 
                          stroke-linecap="round" 
                          fill="none"/>
                </svg>
            `
    } else if (player === "O") {
      cell.innerHTML = `
                <svg viewBox="0 0 100 100" class="neon-o">
                    <circle cx="50" cy="50" r="30" 
                            stroke="#F87171" 
                            stroke-width="8" 
                            fill="none" 
                            stroke-linecap="round"/>
                </svg>
            `
    }

    cell.disabled = true
  }

  showWinningLine() {
    if (!this.winningCombination) return

    const line = document.getElementById("winning-line")
    const style = this.getWinningLineStyle()

    Object.assign(line.style, style)
    line.classList.add("show")
  }

  getWinningLineStyle() {
    if (!this.winningCombination) return {}

    const [a, b, c] = this.winningCombination

    // Row wins
    if (a === 0 && b === 1 && c === 2) return { top: "16.67%", left: "5%", width: "90%", height: "6px" }
    if (a === 3 && b === 4 && c === 5)
      return { top: "50%", left: "5%", width: "90%", height: "6px", transform: "translateY(-50%)" }
    if (a === 6 && b === 7 && c === 8) return { top: "83.33%", left: "5%", width: "90%", height: "6px" }

    // Column wins
    if (a === 0 && b === 3 && c === 6) return { top: "5%", left: "16.67%", width: "6px", height: "90%" }
    if (a === 1 && b === 4 && c === 7)
      return { top: "5%", left: "50%", width: "6px", height: "90%", transform: "translateX(-50%)" }
    if (a === 2 && b === 5 && c === 8) return { top: "5%", left: "83.33%", width: "6px", height: "90%" }

    // Diagonal wins
    if (a === 0 && b === 4 && c === 8)
      return {
        top: "50%",
        left: "50%",
        width: "127%",
        height: "6px",
        transform: "translate(-50%, -50%) rotate(45deg)",
      }
    if (a === 2 && b === 4 && c === 6)
      return {
        top: "50%",
        left: "50%",
        width: "127%",
        height: "6px",
        transform: "translate(-50%, -50%) rotate(-45deg)",
      }

    return {}
  }

  updateScore() {
    if (this.winner === "tie") {
      this.score.ties++
    } else if (this.winner) {
      this.score[this.winner]++
    }
  }

  updateDisplay() {
    // Update status message
    const statusEl = document.getElementById("status-message")
    if (this.winner === "tie") {
      statusEl.textContent = "It's a tie!"
    } else if (this.winner) {
      if (this.gameMode === "ai") {
        statusEl.textContent = this.winner === "X" ? "You win!" : "AI wins!"
      } else {
        statusEl.textContent = `Player ${this.winner} wins!`
      }
    } else {
      if (this.gameMode === "ai") {
        if (this.isAIThinking) {
          statusEl.textContent = "AI thinking..."
        } else {
          statusEl.textContent = this.currentPlayer === "X" ? "Your turn" : "AI thinking..."
        }
      } else {
        statusEl.textContent = `Player ${this.currentPlayer}'s turn`
      }
    }

    // Update score display
    document.getElementById("x-score").textContent = this.score.X
    document.getElementById("o-score").textContent = this.score.O
    document.getElementById("ties-score").textContent = this.score.ties

    // Update labels for AI mode
    document.getElementById("x-label").textContent = this.gameMode === "ai" ? "You" : "Player X"
    document.getElementById("o-label").textContent = this.gameMode === "ai" ? "AI" : "Player O"

    // Update cell states
    document.querySelectorAll(".cell").forEach((cell, index) => {
      const isDisabled = this.board[index] || this.winner || (this.gameMode === "ai" && this.currentPlayer === "O")
      cell.disabled = isDisabled
    })
  }

  resetGame() {
    this.board = Array(9).fill(null)
    this.currentPlayer = "X"
    this.winner = null
    this.winningCombination = null
    this.isAIThinking = false

    // Clear cells
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.innerHTML = ""
      cell.disabled = false
    })

    // Hide winning line
    document.getElementById("winning-line").classList.remove("show")

    this.updateDisplay()
  }

  resetScore() {
    this.score = { X: 0, O: 0, ties: 0 }
    this.updateDisplay()
  }

  switchGameMode(mode) {
    this.gameMode = mode

    // Update button states
    document.getElementById("pvp-btn").classList.toggle("active", mode === "pvp")
    document.getElementById("ai-btn").classList.toggle("active", mode === "ai")

    this.resetGame()
  }
}

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new TicTacToeGame()
})