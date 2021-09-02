/* eslint-disable no-restricted-syntax */
class Sudoku {
  static size = {
    block: 3,
    grid: 9,
  }

  solution: number[] = []

  constructor() {
    this.create()
  }

  create() {
    this.fill()
  }

  print(arr: number[] = this.solution) {
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

  /* -------------------------------- valiation ------------------------------- */
  private isValidRow(i: number, n: number): boolean {
    for (const rI of Sudoku.getRowIndices(i)) {
      if (this.solution[rI] === n) {
        return false
      }
    }

    return true
  }

  private isValidCol(i: number, n: number): boolean {
    for (const cI of Sudoku.getColIndices(i)) {
      if (this.solution[cI] === n) {
        return false
      }
    }

    return true
  }

  private isValidBlock(i: number, n: number): boolean {
    for (const bI of Sudoku.getBlockIdices(i)) {
      if (this.solution[bI] === n) {
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
  private fillDiagonal() {
    const blocks = [0, 30, 60].map(Sudoku.getBlockIdices)

    for (const block of blocks) {
      const nums = Sudoku.randomNums()

      for (const i of block) {
        this.solution[i] = nums.pop()!
      }
    }
  }

  private fillBlanks(data = { limit: 1, found: 0 }, start = 0) {
    const i = this.solution.indexOf(0, start)

    // end of the grid
    if (i === -1) {
      data.found += 1
      return data
    }

    for (const n of this.getValidValues(i)) {
      this.solution[i] = n

      this.fillBlanks(data, i)

      if (data.found === data.limit) {
        return data
      }
    }

    this.solution[i] = 0

    return data
  }

  private randomClean(limit: number) {
    const indices = this.solution
      .map((_, i) => i)
      .sort(() => Math.random() - 0.5)

    let removed = 0
    for (const i of indices) {
      const snapshot = this.solution.slice()

      this.solution[i] = 0
      if (this.fillBlanks({ limit: 2, found: 0 }).found === 1) {
        snapshot[i] = 0
        removed += 1
      }

      this.solution = snapshot

      if (removed === limit) {
        break
      }
    }
  }

  private fill() {
    this.solution = Array(Sudoku.size.grid ** 2).fill(0)
    this.fillDiagonal()
    this.fillBlanks()
    this.randomClean(30)
  }
}

console.time('time')
const s = new Sudoku()

s.print()

// for (let i = 0; i < 1000; i += 1) {
//   s.create()
// }
console.timeEnd('time')
