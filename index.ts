class Sudoku {
  static gridSize = 9

  static blockSize = 3

  solution: number[] = []

  saved = { row: 0, col: 0, n: 0 }

  constructor() {
    this.create()
  }

  create() {
    this.cleanGrid()
    this.cleanSaved()
    this.fill()
  }

  print(arr: number[] = this.solution) {
    const { gridSize, blockSize } = Sudoku
    const N = 23
    const str = '─'.repeat(N / blockSize)

    console.log(`┌${str}┬${str}┬${str}┐`)

    for (let i = 0; i < gridSize; i += 1) {
      const n = i * gridSize

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

  // utils
  private static randomNums(): number[] {
    return [5, 4, 3, 8, 9, 7, 2, 1, 6]
    // return [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5)
  }

  private static getIndex(row: number, col: number) {
    return row * Sudoku.gridSize + col
  }

  private getCell(row: number, col: number): number {
    return this.solution[Sudoku.getIndex(row, col)]
  }

  private setCell(row: number, col: number, n: number) {
    this.solution[Sudoku.getIndex(row, col)] = n
  }

  // saved
  private isSaved(row: number, col: number, n: number): boolean {
    const { saved } = this

    return saved.n === n && saved.row === row && saved.col === col
  }

  private setSaved(row: number, col: number) {
    this.saved = {
      row,
      col,
      n: this.getCell(row, col),
    }
  }

  private recoverSaved() {
    const { row, col, n } = this.saved

    this.setCell(row, col, n)
  }

  // valiation
  private validLinear(row: number, col: number, n: number): boolean {
    for (let i = 0; i < Sudoku.gridSize; i += 1) {
      if (
        this.getCell(row, i) === n || // col
        this.getCell(i, col) === n // row
      ) {
        return false
      }
    }

    return true
  }

  private validBlock(row: number, col: number, n: number): boolean {
    const { blockSize } = Sudoku
    const rowStart = Math.floor(row / blockSize) * blockSize
    const colStart = Math.floor(col / blockSize) * blockSize
    const rowEnd = rowStart + blockSize
    const colEnd = colStart + blockSize

    for (let rowI = rowStart; rowI < rowEnd; rowI += 1) {
      for (let colI = colStart; colI < colEnd; colI += 1) {
        if (this.getCell(rowI, colI) === n) {
          return false
        }
      }
    }

    return true
  }

  private validFill(row: number, col: number, n: number): boolean {
    return this.validLinear(row, col, n) && this.validBlock(row, col, n)
  }

  // fill
  private fill() {
    this.fillDiagonal()
    this.fillCell(0, 0)
    // this.randomClean(30)
    this.print()
    this.randomClean(this.solution.length - 17)
  }

  private fillDiagonal() {
    const { gridSize, blockSize } = Sudoku

    for (let start = 0; start < gridSize; start += blockSize) {
      const end = start + blockSize
      const nums = Sudoku.randomNums()

      for (let row = start; row < end; row += 1) {
        for (let col = start; col < end; col += 1) {
          this.setCell(row, col, nums.pop()!)
        }
      }
    }
  }

  private fillCell(row: number, col: number): boolean {
    const { gridSize } = Sudoku

    // next row
    if (col === gridSize) {
      row += 1
      col = 0
    }

    // end of the grid
    if (row === gridSize) {
      return true
    }

    // pre-filled
    if (this.getCell(row, col)) {
      return this.fillCell(row, col + 1)
    }

    for (let n = 1; n <= gridSize; n += 1) {
      if (!this.isSaved(row, col, n) && this.validFill(row, col, n)) {
        this.setCell(row, col, n)

        if (this.fillCell(row, col + 1)) {
          return true
        }
      }
    }

    this.setCell(row, col, 0)
    return false
  }

  private fill() {
    this.fillDiagonal()
    this.fillCell(0, 0)
    this.randomClean(35)
  }

  // clean
  private cleanGrid() {
    this.solution = Array(Sudoku.gridSize ** 2).fill(0)
  }

  private cleanSaved() {
    this.saved = {
      row: 0,
      col: 0,
      n: 0,
    }
  }

  private randomClean(quantity: number) {
    const { gridSize } = Sudoku
    const his: Set<number> = new Set()
    const limitErrors = this.solution.length - 25

    let i = 0
    while (i < quantity) {
      let row: number
      let col: number

      do {
        row = Math.floor(Math.random() * gridSize)
        col = Math.floor(Math.random() * gridSize)
      } while (
        this.getCell(row, col) === 0 &&
        his.has(Sudoku.getIndex(row, col)) &&
        his.size < limitErrors
      )

      // console.log({ row, col, i })
      his.add(Sudoku.getIndex(row, col))
      this.setSaved(row, col)
      this.setCell(row, col, 0)

      const snapshot = [...this.solution]

      if (this.fillCell(0, 0)) {
        this.recoverSaved()
      } else {
        i += 1
      }

      this.solution = snapshot
      this.cleanSaved()
    }
  }
}

console.time('time')
const s1 = new Sudoku()

// s1.print()

for (let i = 0; i < 10000; i += 1) {
  s1.create()
}
console.timeEnd('time')
