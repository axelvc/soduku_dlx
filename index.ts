/* eslint-disable no-restricted-syntax */
class Sudoku {
  static size = {
    block: 3,
    grid: 9,
  }

  puzzle: number[] = []

  solution: number[] = []

  constructor() {
    this.create()
  }

  create() {
    this.cleanGrid()
    this.fillDiagonal()
    this.fillBlanks()
    this.randomClean(30)
  }

  print(arr: number[] = this.puzzle) {
    const { size } = Sudoku
    const N = 23
    const str = '─'.repeat(N / size.block)

    console.log(`┌${str}┬${str}┬${str}┐`)

    for (let i = 0; i < size.grid; i += 1) {
      const n = i * size.grid

      console.log(
        [
          '│',
          ...arr.slice(0 + n, 3 + n),
          '│',
          ...arr.slice(3 + n, 6 + n),
          '│',
          ...arr.slice(6 + n, 9 + n),
          '│',
        ].join(' '),
      )

      if (i === 2 || i === 5) {
        console.log(`├${str}┼${str}┼${str}┤`)
      }
    }

    console.log(`└${str}┴${str}┴${str}┘`)
  }

  /* ---------------------------------- utils --------------------------------- */
  private static randomNums(): number[] {
    return [5, 4, 3, 8, 9, 7, 2, 1, 6]
    // return [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5)
  }

  private getRandomIndices() {
    return this.puzzle.map((_, i) => i).sort(() => Math.random() - 0.5)
  }

  private static getIndex(row: number, col: number): number {
    return row * Sudoku.size.grid + col
  }

  private static getRowIndices(i: number): number[] {
    const { size } = Sudoku
    const row = Math.floor(i / size.grid)

    const indices = []
    for (let col = 0; col < size.grid; col += 1) {
      indices.push(Sudoku.getIndex(row, col))
    }

    return indices
  }

  private static getColIndices(i: number): number[] {
    const { size } = Sudoku
    const col = i % size.grid

    const indices = []
    for (let row = 0; row < size.grid; row += 1) {
      indices.push(Sudoku.getIndex(row, col))
    }

    return indices
  }

  private static getBlockIdices(i: number): number[] {
    const { size } = Sudoku
    const row = Math.floor(i / size.grid)
    const col = i % size.grid
    const rowStart = row - (row % size.block)
    const colStart = col - (col % size.block)

    const indices = []
    for (let r = 0; r < size.block; r += 1) {
      for (let c = 0; c < size.block; c += 1) {
        indices.push(Sudoku.getIndex(rowStart + r, colStart + c))
      }
    }

    return indices
  }

  private getValidValues(i: number): number[] {
    const nums = []

    for (let n = 1; n <= Sudoku.size.grid; n += 1) {
      if (this.isValid(i, n)) {
        nums.push(n)
      }
    }

    return nums
  }

  private getSolutions(
    limit: number = Infinity,
    found: number[][] = [],
    start: number = 0,
  ): number[][] {
    const i = this.puzzle.indexOf(0, start)

    // end of the grid
    if (i === -1) {
      found.push(this.puzzle.slice())

      return found
    }

    for (const n of this.getValidValues(i)) {
      this.puzzle[i] = n

      this.getSolutions(limit, found, i)

      if (found.length >= limit) {
        break
      }
    }

    this.puzzle[i] = 0

    return found
  }

  /* -------------------------------- valiation ------------------------------- */
  private isValidRow(i: number, n: number): boolean {
    for (const rI of Sudoku.getRowIndices(i)) {
      if (this.puzzle[rI] === n) {
        return false
      }
    }

    return true
  }

  private isValidCol(i: number, n: number): boolean {
    for (const cI of Sudoku.getColIndices(i)) {
      if (this.puzzle[cI] === n) {
        return false
      }
    }

    return true
  }

  private isValidBlock(i: number, n: number): boolean {
    for (const bI of Sudoku.getBlockIdices(i)) {
      if (this.puzzle[bI] === n) {
        return false
      }
    }

    return true
  }

  private isValid(i: number, n: number): boolean {
    return (
      this.isValidRow(i, n) && this.isValidCol(i, n) && this.isValidBlock(i, n)
    )
  }

  /* ---------------------------------- fill ---------------------------------- */
  private cleanGrid() {
    const length = Sudoku.size.grid ** 2

    this.puzzle = Array(length).fill(0)
  }

  private fillDiagonal() {
    const blocks = [0, 30, 60].map(Sudoku.getBlockIdices)

    for (const block of blocks) {
      const nums = Sudoku.randomNums()

      for (const i of block) {
        this.puzzle[i] = nums.pop()!
      }
    }
  }

  private fillBlanks() {
    const [solution] = this.getSolutions(1)

    this.puzzle = solution
  }

  private randomClean(limit: number) {
    this.solution = this.puzzle.slice()

    let removed = 0
    for (const i of this.getRandomIndices()) {
      const snapshot = this.puzzle[i]

      this.puzzle[i] = 0

      if (this.getSolutions(2).length > 1) {
        this.puzzle[i] = snapshot
      } else {
        removed += 1
      }

      if (removed === limit) {
        break
      }
    }
  }
}

console.time('time')
const s = new Sudoku()

s.print()
s.print(s.solution)

// for (let i = 0; i < 1000; i += 1) {
//   s.create()
// }
console.timeEnd('time')
