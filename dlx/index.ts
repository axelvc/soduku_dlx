import Header from './Header.ts'
import Node from './Node.ts'

export default class Dlx {
  private static limit = Number.MAX_SAFE_INTEGER

  private root: Header = new Header()

  matrix: number[][]

  constructor(matrix: number[][]) {
    this.matrix = matrix
    this.makeLinkedList()
  }

  /* ------------------------------- linked list ------------------------------ */
  private makeCols(): Header[] {
    const cols: Header[] = []

    this.matrix[0]?.forEach(() => {
      const header = new Header(this.root)

      this.root.addRight(header)
      cols.push(header)
    })

    return cols
  }

  private makeNodes(cols: Header[]) {
    this.matrix.forEach((row, rI) => {
      let first: Node | undefined

      row.forEach((cell, cI) => {
        if (cell) {
          const header = cols[cI]
          const node = new Node(rI, header)

          first ||= node

          header.addDown(node)
          first.addRight(node)
        }
      })
    })
  }

  private makeLinkedList() {
    this.root = new Header()

    const cols = this.makeCols()
    this.makeNodes(cols)
  }

  /* ------------------------------- dxl-solver ------------------------------- */
  private minColumn(): Header {
    return this.root
      .nodesRight<Header>()
      .reduce((a, b) => (a.count > b.count ? b : a))
  }

  private getSolutions(
    limit: number,
    solutions: number[][] = [],
    stack: number[] = [],
  ) {
    if (this.root.right === this.root) {
      solutions.push(stack.slice().sort((a, b) => a - b))

      return solutions
    }

    const header = this.minColumn()

    header.cover()

    header.nodesDown().forEach((rowNode) => {
      if (solutions.length >= limit) {
        return
      }

      rowNode.nodesRight().forEach((node) => {
        node.header.cover()
      })

      stack.push(rowNode.row)
      this.getSolutions(limit, solutions, stack)
      stack.pop()

      rowNode.nodesRight().forEach((node) => {
        node.header.uncover()
      })
    })

    header.uncover()

    return solutions
  }

  solve(limit: number = Dlx.limit) {
    this.makeLinkedList()

    return this.getSolutions(limit)
  }
}
