export default class Node {
  up: Node = this

  down: Node = this

  left: Node = this

  right: Node = this

  header: Node = this

  count: number = 0

  row: number = -1

  constructor(row?: number, header?: Node) {
    if (Number.isInteger(row)) {
      this.row = <number>row
    }

    if (header) {
      this.header = header
    }
  }

  /* ---------------------------------- utils --------------------------------- */
  get nodesRight(): Node[] {
    const nodes: Node[] = []

    for (let node = this.right; node !== this; node = node.right) {
      nodes.push(node)
    }

    return nodes
  }

  get nodesDown(): Node[] {
    const nodes: Node[] = []

    for (let node = this.down; node !== this; node = node.down) {
      nodes.push(node)
    }

    return nodes
  }

  get minColumn(): Node {
    return this.nodesRight.reduce((a, b) => (a.count < b.count ? a : b))
  }

  /* --------------------------------- insert --------------------------------- */
  addHorizontal(node: Node) {
    const last = this.left

    last.right = node
    node.left = last
    node.right = this
    this.left = node
  }

  addVertical(node: Node) {
    const last = this.up

    last.down = node
    node.up = last
    node.down = this
    this.up = node

    this.count += 1
  }

  /* ---------------------------------- cover --------------------------------- */
  cover() {
    const { header } = this

    header.right.left = header.left
    header.left.right = header.right

    header.nodesDown.forEach((rowNode) => {
      rowNode.nodesRight.forEach((node) => {
        node.up.down = node.down
        node.down.up = node.up

        node.header.count -= 1
      })
    })
  }

  uncover() {
    const { header } = this

    header.right.left = header
    header.left.right = header

    header.nodesDown.forEach((rowNode) => {
      rowNode.nodesRight.forEach((node) => {
        node.up.down = node
        node.down.up = node

        node.header.count += 1
      })
    })
  }
}
