import Node from './Node.ts'
import Header from './Header.ts'

export default function makeMatrix(matrix: number[][]): Header {
  const root = new Header()
  const headers: Header[] = []

  matrix.forEach((row, rI) => {
    let firstAtRow: Node | undefined

    row.forEach((cell, colI) => {
      // create header
      if (rI === 0) {
        const header = new Header(root)

        headers.push(header)
      }

      // create node
      if (cell) {
        const header = headers[colI]
        const node = new Node(rI, header, firstAtRow)

        firstAtRow = firstAtRow || node
      }
    })
  })

  return root
}
