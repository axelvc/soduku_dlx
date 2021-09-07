import makeMatrix from './matrix.ts'
import Node from './Node.ts'

function getSolutions(
  root: Node,
  limit: number,
  solutions: number[][] = [],
  stack: number[] = [],
) {
  if (root.right === root) {
    solutions.push([...stack].sort((a, b) => a - b))

    return solutions
  }

  const header = root.minColumn

  header.cover()

  header.nodesDown.forEach((rowNode) => {
    if (solutions.length >= limit) {
      return
    }

    rowNode.nodesRight.forEach((node) => node.cover())

    stack.push(rowNode.row)
    getSolutions(root, limit, solutions, stack)
    stack.pop()

    rowNode.nodesRight.forEach((node) => node.uncover())
  })

  header.uncover()

  return solutions
}

export default function solve(
  matrix: number[][],
  limit: number = Number.MAX_SAFE_INTEGER,
) {
  const root = makeMatrix(matrix)

  return getSolutions(root, limit)
}
