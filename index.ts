import dlxSolve from './dlx/index.ts'

interface Cord {
  row: number
  col: number
}

class Sudoku {
  static size = {
    row: 9,
    col: 9,
    block: 3,
  }

  static matrixBase: number[][] = Sudoku.makeMatrix()

  matrix: number[][] = Sudoku.matrixBase.slice()

  matrixDeleteHistory: Record<number, number[][]> = {}

  puzzle: number[][] = []

  solution: number[][] = []

  constructor() {
    this.create()
  }

  create() {
    this.cleanGrid()
    this.fillDiagonal()
    this.fillBlanks()
    this.randomClean(35)
  }

  print(matrix: number[][] = this.puzzle) {
    const { size } = Sudoku
    const L = `${size.row}`.length
    const str = '─'.repeat(L * size.block + (size.block - 1) + 2)

    console.log(`┌${`${str}┬`.repeat(size.block).slice(0, -1)}┐`)

    matrix.forEach((row, i) => {
      const s: (number | string)[] = ['│']

      for (let col = 0; col < size.col; col += size.block) {
        s.push(
          ...row.slice(col, col + size.block).map((n) => `${n}`.padEnd(L, ' ')),
          '│',
        )
      }

      console.log(s.join(' '))

      if (i > 0 && i < size.col - 1 && (i + 1) % size.block === 0) {
        console.log(`├${`${str}┼`.repeat(size.block).slice(0, -1)}┤`)
      }
    })

    console.log(`└${`${str}┴`.repeat(size.block).slice(0, -1)}┘`)
  }

  /* ---------------------------------- utils --------------------------------- */
  private static getSize() {
    const { size } = Sudoku

    return size.row * size.col
  }

  private static getIndex(row: number, col: number): number {
    return row * Sudoku.size.row + col
  }

  private static getRowCol(i: number): Cord {
    const { size } = Sudoku

    const row = Math.floor(i / size.row)
    const col = i % size.col

    return { row, col }
  }

  private static makeMatrixRow(n: number, row: number, col: number): number[] {
    const { size } = Sudoku
    const length = Sudoku.getSize()
    const rowArr: number[] = Array(length * 4).fill(0)

    const rowBreak = length
    const colBreak = length * 2
    const blockBreak = length * 3

    const blockRow = Math.floor(row / size.block) * size.block
    const blockCol = Math.floor(col / size.block) * size.col

    const rI = Sudoku.getIndex(row, col)
    const i = n - 1

    rowArr[rI] = n
    rowArr[size.row * row + rowBreak + i] = n
    rowArr[size.row * col + colBreak + i] = n
    rowArr[size.row * blockRow + blockCol + blockBreak + i] = n

    return rowArr
  }

  private static makeMatrix(): number[][] {
    const { size } = Sudoku
    const matrix: number[][] = []

    for (let row = 0; row < size.row; row += 1) {
      for (let col = 0; col < size.col; col += 1) {
        for (let n = 1; n <= size.row; n += 1) {
          const arr = Sudoku.makeMatrixRow(n, row, col)

          matrix.push(arr)
        }
      }
    }

    return matrix
  }

  private static randomNums(): number[] {
    // return [5, 4, 3, 8, 9, 7, 2, 1, 6]
    return Array(Sudoku.size.row)
      .fill(0)
      .map((_, i) => i + 1)
      .sort(() => Math.random() - 0.5)
  }

  private static getRandomIndices(): Cord[] {
    return Array<number>(Sudoku.getSize())
      .fill(0)
      .map((_, i) => Sudoku.getRowCol(i))
      .sort(() => Math.random() - 0.5)
  }

  private removeFromMatrix(n: number, row: number, col: number) {
    const i = Sudoku.getIndex(row, col)
    const mI = this.matrix.findIndex((r) => r[i] === n)
    const mIStart = mI - n + 1

    if (mI === -1) {
      console.log('remove fail:', { n, row, col })
    }

    const mRow = this.matrix[mI]

    this.matrixDeleteHistory[i] = this.matrix.splice(mIStart, Sudoku.size.row, mRow)
  }

  private restoreToMatrix(n: number, row: number, col: number) {
    const i = Sudoku.getIndex(row, col)
    const mI = this.matrix.findIndex((r) => r[i] === n)

    if (mI === -1) {
      console.log('restore fail:', { n, row, col })
    }

    this.matrix.splice(mI, 1, ...this.matrixDeleteHistory[i])
  }

  /* ---------------------------------- fill ---------------------------------- */
  private cleanGrid() {
    const { size } = Sudoku

    this.matrix = Sudoku.matrixBase.slice()
    this.matrixDeleteHistory = {}

    this.puzzle = Array(size.row)
      .fill(0)
      .map(() => Array(size.col).fill(0))
  }

  private fillDiagonal() {
    const { size } = Sudoku

    for (let i = 0; i < size.block; i += 1) {
      const nums = Sudoku.randomNums()
      const start = i * size.block

      for (let row = 0; row < size.block; row += 1) {
        for (let col = 0; col < size.block; col += 1) {
          const n = nums.pop()!
          const r = start + row
          const c = start + col

          this.puzzle[r][c] = n
          this.removeFromMatrix(n, r, c)
        }
      }
    }
  }

  private fillBlanks() {
    const [solution] = dlxSolve(this.matrix, 1)

    // set puzzle values
    solution.forEach((mI, i) => {
      const { row, col } = Sudoku.getRowCol(i)

      this.puzzle[row][col] = this.matrix[mI][i]
    })

    // remove values from matrix
    solution.forEach((_, i) => {
      const { row, col } = Sudoku.getRowCol(i)

      if (!this.matrixDeleteHistory[i]) {
        this.removeFromMatrix(this.puzzle[row][col], row, col)
      }
    })
  }

  private randomClean(limit: number) {
    this.solution = this.puzzle.slice()

    let removed = 0
    for (const { row, col } of Sudoku.getRandomIndices()) {
      const snapshot = this.puzzle[row][col]

      this.puzzle[row][col] = 0

      this.restoreToMatrix(snapshot, row, col)
      const solutions = dlxSolve(this.matrix, 2)

      if (solutions.length > 1) {
        this.puzzle[row][col] = snapshot
        this.removeFromMatrix(snapshot, row, col)
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
const s1 = new Sudoku()

s1.print()

// for (let i = 0; i < 1000; i += 1) {
//   s1.create()
// }
console.timeEnd('time')
