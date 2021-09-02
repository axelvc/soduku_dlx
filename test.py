from time import time
from random import shuffle

blockSize = 3
gridSize = 9
gridLength = 81


def printS(puzzle):
    N = 23
    s = '─' * (N // blockSize)

    print(f'┌{s}┬{s}┬{s}┐')

    for i in range(gridSize):
        n = i * gridSize

        print(
            '│',
            ' '.join(map(str, puzzle[0+n:3+n])),
            '│',
            ' '.join(map(str, puzzle[3+n:6+n])),
            '│',
            ' '.join(map(str, puzzle[6+n:9+n])),
            '│',
        )

        if i == 2 or i == 5:
            print(f'├{s}┼{s}┼{s}┤')

    print(f'└{s}┴{s}┴{s}┘')


class Sudoku():
    solution = [0] * gridLength
    puzzle = [0] * gridLength

    def __init__(self):
        self.create()

    def create(self):
        self.cleanGrid()
        self.fillDiagonal()
        self.fillBlanks()
        self.randomClean(35)

    # ---------------------------------- utils ---------------------------------
    def randomNums(self):
        return [5, 4, 3, 8, 9, 7, 2, 1, 6]
        # arr = list(range(1, gridSize + 1))
        # shuffle(arr)

        # return arr

    def getIndex(self, row, col):
        return row * gridSize + col

    def getRowIdxs(self, i):
        row = i // gridSize

        return (self.getIndex(row, col) for col in range(gridSize))

    def getColIdxs(self, i):
        col = i % gridSize

        return (self.getIndex(row, col) for row in range(gridSize))

    def getBlockIdxs(self, i):
        row = i // gridSize
        col = i % gridSize
        rowStart = row // blockSize * blockSize
        colStart = col // blockSize * blockSize

        return (
            self.getIndex(rowStart + r, colStart + c)
            for c in range(3)
            for r in range(3)
        )

    def getRandomIndices(self):
        indices = list(range(len(self.puzzle)))
        shuffle(indices)

        return indices

    def getValidValues(self, i):
        return (n for n in range(1, gridSize + 1) if self.isValid(i, n))

    def getSolutions(self, limit, found, start):
        try:
            i = self.puzzle.index(0, start)
        except:
            found.append(self.puzzle[::])

            return found

        for n in self.getValidValues(i):
            self.puzzle[i] = n

            self.getSolutions(limit, found, i)

            if (len(found) >= limit):
                break

        self.puzzle[i] = 0

        return found

    # -------------------------------- valiation -------------------------------
    def isValidRow(self, i, n):
        for rI in self.getRowIdxs(i):
            if self.puzzle[rI] == n:
                return False

        return True

    def isValidCol(self, i, n):
        for cI in self.getColIdxs(i):
            if self.puzzle[cI] == n:
                return False

        return True

    def isValidBlock(self, i, n):
        for bI in self.getBlockIdxs(i):
            if self.puzzle[bI] == n:
                return False

        return True

    def isValid(self, i, n):
        return self.isValidRow(i, n) and self.isValidCol(i, n) and self.isValidBlock(i, n)

    # ---------------------------------- fill ----------------------------------
    def cleanGrid(self):
        self.puzzle = [0] * gridLength

    def fillDiagonal(self):
        blocks = map(self.getBlockIdxs, [0, 30, 60])

        for block in blocks:
            nums = self.randomNums()

            for i in block:
                self.puzzle[i] = nums.pop()

    def fillBlanks(self):
        [solution] = self.getSolutions(1, [], 0)

        self.puzzle = solution

    def randomClean(self, limit):
        self.solution = self.puzzle[::]

        removed = 0
        for i in self.getRandomIndices():
            snapshot = self.puzzle[i]

            self.puzzle[i] = 0

            if (len(self.getSolutions(2, [], 0)) > 1):
                self.puzzle[i] = snapshot
            else:
                removed += 1

            if (removed == limit):
                break


if __name__ == '__main__':
    t = time()
    s = Sudoku()

    # printS(s.solution)
    # printS(s.puzzle)

    for i in range(1000):
        s.create()

    tt = round((time() - t) * 1000)
    print(f'time: {tt}ms')
