import Node from './Node'

function makeHeader(root: Node): Node {
  const header = new Node()

  root.addHorizontal(header)

  return header
}

function makeNode(row: number, header: Node, rowFirst?: Node): Node {
  const node = new Node(row, header)

  header.addVertical(node)

  if (rowFirst) {
    rowFirst.addHorizontal(node)
  }

  return node
}

export default function makeMatrix(matrix: number[][]): Node {
  const root = new Node()
  const headers: Node[] = []

  matrix.forEach((row, rowI) => {
    let rowFirst: Node | undefined

    row.forEach((cell, colI) => {
      // create header
      if (rowI === 0) {
        headers.push(makeHeader(root))
      }

      // create node
      if (cell) {
        const header = headers[colI]
        const node = makeNode(rowI, header, rowFirst)

        rowFirst = rowFirst || node
      }
    })
  })

  return root
}
