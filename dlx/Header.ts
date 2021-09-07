import NodeBase from './NodeBase.ts'

export default class Header extends NodeBase {
  row = -1

  count = 0

  root: Header = this

  constructor(root?: Header) {
    super()

    if (root) {
      this.root = root
    }

    this.root.addToRow(this)
  }

  /* ---------------------------------- utils --------------------------------- */
  minColumn(): Header {
    return this.nodesRight<Header>().reduce((a, b) => (a.count < b.count ? a : b))
  }

  /* --------------------------------- insert --------------------------------- */
  addToCol(node: NodeBase) {
    const last = this.up

    last.down = node
    node.up = last
    node.down = this
    this.up = node

    this.count += 1
  }

  /* ---------------------------------- cover --------------------------------- */
  cover() {
    this.right.left = this.left
    this.left.right = this.right

    this.nodesDown().forEach((rowNode) => {
      rowNode.nodesRight().forEach((node) => {
        node.up.down = node.down
        node.down.up = node.up

        node.header.count -= 1
      })
    })
  }

  uncover() {
    this.right.left = this
    this.left.right = this

    this.nodesDown().forEach((rowNode) => {
      rowNode.nodesRight().forEach((node) => {
        node.up.down = node
        node.down.up = node

        node.header.count += 1
      })
    })
  }
}
