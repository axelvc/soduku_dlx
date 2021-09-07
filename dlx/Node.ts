import NodeBase from './NodeBase.ts'
import Header from './Header.ts'

export default class Node extends NodeBase {
  header: Header

  row: number

  constructor(row: number, header: Header, firstAtRow?: Node) {
    super()
    this.row = row
    this.header = header

    header.addToCol(this)

    if (firstAtRow) {
      firstAtRow.addToRow(this)
    }
  }
}
