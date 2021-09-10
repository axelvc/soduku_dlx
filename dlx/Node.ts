import NodeBase from './NodeBase.ts'
import Header from './Header.ts'

export default class Node extends NodeBase {
  header: Header

  row: number

  constructor(row: number, header: Header) {
    super()

    this.row = row

    this.header = header
  }

  /* ---------------------------------- cover --------------------------------- */
  coverUpDown() {
    this.up.down = this.down
    this.down.up = this.up

    this.header.count -= 1
  }

  uncoverUpDown() {
    this.up.down = this
    this.down.up = this

    this.header.count += 1
  }
}
