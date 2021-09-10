import NodeBase from './NodeBase.ts'

export default class Header extends NodeBase {
  root: Header

  count = 0

  constructor(root?: Header) {
    super()

    this.root = root || this
  }

  addDown(node: NodeBase) {
    const last = this.up

    last.down = node
    node.up = last
    node.down = this
    this.up = node

    this.count += 1
  }

  /* ---------------------------------- cover --------------------------------- */
  coverCol() {
    this.right.left = this.left
    this.left.right = this.right

    this.count -= 1
  }

  uncoverCol() {
    this.right.left = this
    this.left.right = this

    this.count += 1
  }

  coverRow() {
    this.nodesRight().forEach((node) => {
      node.coverUpDown()
    })
  }

  uncoverRow() {
    this.nodesRight().forEach((node) => {
      node.uncoverUpDown()
    })
  }

  cover() {
    this.coverCol()

    this.nodesDown().forEach((rowNode) => {
      rowNode.nodesRight().forEach((node) => {
        node.coverUpDown()
      })
    })
  }

  uncover() {
    this.uncoverCol()

    this.nodesDown().forEach((rowNode) => {
      rowNode.nodesRight().forEach((node) => {
        node.uncoverUpDown()
      })
    })
  }
}
