import Node from './Node.ts'

export default class NodeBase {
  up: NodeBase = this

  down: NodeBase = this

  left: NodeBase = this

  right: NodeBase = this

  /* ---------------------------------- utils --------------------------------- */
  nodesRight<T = Node>(): T[] {
    const nodes: T[] = []

    for (let node = this.right; node !== this; node = node.right) {
      nodes.push(<T>(<unknown>node))
    }

    return nodes
  }

  nodesDown<T = Node>(): T[] {
    const nodes: T[] = []

    for (let node = this.down; node !== this; node = node.down) {
      nodes.push(<T>(<unknown>node))
    }

    return nodes
  }

  /* --------------------------------- insert --------------------------------- */
  addToRow(node: NodeBase) {
    const last = this.left

    last.right = node
    node.left = last
    node.right = this
    this.left = node
  }
}
