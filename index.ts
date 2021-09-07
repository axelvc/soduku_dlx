import dlxSolve from './dlx/index.ts'

class Sudoku {
  static size = {
    side: 9,
    block: 3,
  }

  static matrixBase: number[][] = Sudoku.makeMatrix()

  matrix: number[][] = Sudoku.matrixBase.slice()

  matrixDeleteHistory: Record<number, number[][]> = {}

  puzzle: number[] = []

  solution: number[] = []

  cellToRemove = 35

  constructor() {
    this.create()
  }

  create() {
    this.cleanGrid()
    this.fillDiagonal()
    this.fillBlanks()
    this.randomClean()
  }

  print(puzzle: number[] = this.puzzle) {
    const { size } = Sudoku
    const L = `${size.side}`.length
    const str = '─'.repeat(L * size.block + (size.block - 1) + 2)

    console.log(`┌${`${str}┬`.repeat(size.block).slice(0, -1)}┐`)

    for (let row = 0; row < size.side; row += 1) {
      const s: (number | string)[] = ['│']

      for (let col = 0; col < size.side; col += 1) {
        s.push(puzzle[Sudoku.getIndex(row, col)])
      }

      for (let i = size.block; i > 0; i -= 1) {
        s.splice(size.block * i + 1, 0, '│')
      }

      console.log(s.join(' '))

      if (row > 0 && row < size.side - 1 && (row + 1) % size.block === 0) {
        console.log(`├${`${str}┼`.repeat(size.block).slice(0, -1)}┤`)
      }
    }

    console.log(`└${`${str}┴`.repeat(size.block).slice(0, -1)}┘`)
  }

  /* ---------------------------------- utils --------------------------------- */
  private static getSize() {
    return Sudoku.size.side ** 2
  }

  private static getIndex(row: number, col: number): number {
    return row * Sudoku.size.side + col
  }

  private static makeMatrixRow(n: number, row: number, col: number): number[] {
    const { size } = Sudoku
    const length = Sudoku.getSize()
    const rowArr: number[] = Array(length * 4).fill(0)

    const rowBreak = length
    const colBreak = length * 2
    const blockBreak = length * 3

    const blockRow = Math.floor(row / size.block) * size.block
    const blockCol = Math.floor(col / size.block) * size.side

    const rI = Sudoku.getIndex(row, col)
    const i = n - 1

    rowArr[rI] = n
    rowArr[size.side * row + rowBreak + i] = n
    rowArr[size.side * col + colBreak + i] = n
    rowArr[size.side * blockRow + blockCol + blockBreak + i] = n

    return rowArr
  }

  private static makeMatrix(): number[][] {
    const { size } = Sudoku
    const matrix: number[][] = []

    for (let row = 0; row < size.side; row += 1) {
      for (let col = 0; col < size.side; col += 1) {
        for (let n = 1; n <= size.side; n += 1) {
          const arr = Sudoku.makeMatrixRow(n, row, col)

          matrix.push(arr)
        }
      }
    }

    return matrix
  }

  private static randomNums(): number[] {
    // return [5, 4, 3, 8, 9, 7, 2, 1, 6]
    return Array(Sudoku.size.side)
      .fill(0)
      .map((_, i) => i + 1)
      .sort(() => Math.random() - 0.5)
  }

  private getRandomIndices(): number[] {
    return this.puzzle.map((_, i) => i).sort(() => Math.random() - 0.5)
  }

  private removeFromMatrix(n: number, i: number) {
    const mI = this.matrix.findIndex((r) => r[i] === n)
    const mIStart = mI - n + 1

    const mRow = this.matrix[mI]

    this.matrixDeleteHistory[i] = this.matrix.splice(mIStart, Sudoku.size.side, mRow)
  }

  private restoreToMatrix(n: number, i: number) {
    const mI = this.matrix.findIndex((r) => r[i] === n)

    this.matrix.splice(mI, 1, ...this.matrixDeleteHistory[i])
  }

  /* ---------------------------------- fill ---------------------------------- */
  private cleanGrid() {
    this.matrix = Sudoku.matrixBase.slice()
    this.matrixDeleteHistory = {}

    this.puzzle = Array(Sudoku.getSize()).fill(0)
  }

  private fillDiagonal() {
    const { size } = Sudoku

    for (let j = 0; j < size.block; j += 1) {
      const nums = Sudoku.randomNums()
      const start = j * size.block

      for (let row = 0; row < size.block; row += 1) {
        for (let col = 0; col < size.block; col += 1) {
          const n = nums.pop()!
          const i = Sudoku.getIndex(start + row, start + col)

          this.puzzle[i] = n
          this.removeFromMatrix(n, i)
        }
      }
    }
  }

  private fillBlanks() {
    const [solution] = dlxSolve(this.matrix, 1)

    // set puzzle values
    solution.forEach((mI, i) => {
      this.puzzle[i] = this.matrix[mI][i]
    })

    // remove values from matrix
    solution.forEach((_, i) => {
      if (!this.matrixDeleteHistory[i]) {
        this.removeFromMatrix(this.puzzle[i], i)
      }
    })
  }

  private randomClean() {
    this.solution = this.puzzle.slice()

    let removed = 0
    for (const i of this.getRandomIndices()) {
      const snapshot = this.puzzle[i]

      this.puzzle[i] = 0

      this.restoreToMatrix(snapshot, i)
      const solutions = dlxSolve(this.matrix, 2)

      if (solutions.length > 1) {
        this.puzzle[i] = snapshot
        this.removeFromMatrix(snapshot, i)
      } else {
        removed += 1
      }

      if (removed === this.cellToRemove) {
        break
      }
    }
  }
}

console.time('time')
const s1 = new Sudoku()

s1.print()

// for (let i = 0; i < 100; i += 1) {
//   s1.create()
// }
console.timeEnd('time')
