import dlxSolve from './dlx/index.ts'

class Sudoku {
  static size = {
    side: 9,
    block: 3,
  }

  static matrixBase: number[][] = Sudoku.makeDlxMatrix()

  matrix: number[][] = Sudoku.matrixBase.slice()

  matrixDeleteHistory: Record<number, number[][]> = {}

  puzzle: number[] = []

  solution: number[] = []

  cellToRemove = 35

  constructor() {
    this.create()
  }

  create() {
    this.cleanData()
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

  private static randomNums(): number[] {
    return Array(Sudoku.size.side)
      .fill(0)
      .map((_, i) => i + 1)
      .sort(() => Math.random() - 0.5)
  }

  private static getEmptyArray(): number[] {
    const length = Sudoku.size.side ** 2

    return Array(length).fill(0)
  }

  private static getRandomIndices(): number[] {
    return Sudoku.getEmptyArray()
      .map((_, i) => i)
      .sort(() => Math.random() - 0.5)
  }

  private static getIndex(row: number, col: number): number {
    return row * Sudoku.size.side + col
  }

  /* ------------------------------- dlx-matrix ------------------------------- */
  private static indexConstraint(n: number, row: number, col: number): number[] {
    const constraint = Sudoku.getEmptyArray()
    const i = Sudoku.getIndex(row, col)

    constraint[i] = n

    return constraint
  }

  private static rowConstraint(n: number, row: number): number[] {
    const constraint = Sudoku.getEmptyArray()

    constraint[Sudoku.size.side * row + n - 1] = n

    return constraint
  }

  private static colConstraint(n: number, col: number): number[] {
    const constraint = Sudoku.getEmptyArray()

    constraint[Sudoku.size.side * col + n - 1] = n

    return constraint
  }

  private static blockConstraint(n: number, row: number, col: number): number[] {
    const { size } = Sudoku
    const constraint = Sudoku.getEmptyArray()

    const blockRow = Math.floor(row / size.block) * size.block
    const blockCol = Math.floor(col / size.block) * size.side

    constraint[size.side * blockRow + blockCol + n - 1] = n

    return constraint
  }

  private static makeConstraints(n: number, row: number, col: number): number[] {
    return [
      ...Sudoku.indexConstraint(n, row, col),
      ...Sudoku.rowConstraint(n, row),
      ...Sudoku.colConstraint(n, col),
      ...Sudoku.blockConstraint(n, row, col),
    ]
  }

  private static makeDlxMatrix(): number[][] {
    const { size } = Sudoku
    const matrix: number[][] = []

    for (let row = 0; row < size.side; row += 1) {
      for (let col = 0; col < size.side; col += 1) {
        for (let n = 1; n <= size.side; n += 1) {
          const constraints = Sudoku.makeConstraints(n, row, col)

          matrix.push(constraints)
        }
      }
    }

    return matrix
  }

  /* --------------------------- posibilities matrix -------------------------- */
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
  private cleanData() {
    this.puzzle = Sudoku.getEmptyArray()
    this.matrix = Sudoku.matrixBase.slice()
    this.matrixDeleteHistory = {}
  }

  private fillDiagonal() {
    const { size } = Sudoku

    for (let bI = 0; bI < size.block; bI += 1) {
      const nums = Sudoku.randomNums()
      const blockStart = bI * size.block

      for (let row = 0; row < size.block; row += 1) {
        for (let col = 0; col < size.block; col += 1) {
          const n = nums.pop()!
          const i = Sudoku.getIndex(blockStart + row, blockStart + col)

          this.puzzle[i] = n
          this.removeFromMatrix(n, i)
        }
      }
    }
  }

  private fillBlanks() {
    const [solution] = dlxSolve(this.matrix, 1)

    // set solution
    solution.forEach((mI, i) => {
      this.puzzle[i] = this.matrix[mI][i]
    })

    // remove values from dlx-matrix
    solution.forEach((_, i) => {
      if (!this.matrixDeleteHistory[i]) {
        this.removeFromMatrix(this.puzzle[i], i)
      }
    })
  }

  private randomClean() {
    this.solution = this.puzzle.slice()

    let removed = 0
    for (const i of Sudoku.getRandomIndices()) {
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
