from time import time
from random import shuffle

blockSize = 3
gridSize = 9
gridLength = 81


class Sudoku():
    solution = [0] * gridLength

    def __init__(self):
        self.create()

    def create(self):
        self.fill()

    def print(self):
        N = 23
        s = '─' * (N // blockSize)

        print(f'┌{s}┬{s}┬{s}┐')

        for i in range(gridSize):
            n = i * gridSize

            print(
                '│',
                ' '.join(map(str, self.solution[0+n:3+n])),
                '│',
                ' '.join(map(str, self.solution[3+n:6+n])),
                '│',
                ' '.join(map(str, self.solution[6+n:9+n])),
                '│',
            )

            if i == 2 or i == 5:
                print(f'├{s}┼{s}┼{s}┤')

        print(f'└{s}┴{s}┴{s}┘')

    # ---------------------------------- utils ---------------------------------
    def randomNums(self):
        # return [5, 4, 3, 8, 9, 7, 2, 1, 6]
        arr = list(range(1, gridSize + 1))
        shuffle(arr)

        return arr

    def getIndex(self, row, col):
        return row * gridSize + col

    def getRowIdxs(self, i):
        row = i // gridSize

        return (self.getIndex(row, col) for col in range(gridSize))

    def getColIdxs(self, i):
        col = i % gridSize

        return (self.getIndex(row, col) for row in range(gridSize))

    def getBlockIdxs(self, i):
        rowI = i // gridSize
        colI = i % gridSize
        rowStart = rowI // blockSize * blockSize
        colStart = colI // blockSize * blockSize
        rowEnd = rowStart + blockSize
        colEnd = colStart + blockSize

        return (
            self.getIndex(row, col)
            for col in range(colStart, colEnd)
            for row in range(rowStart, rowEnd)
        )

    def getValidValues(self, i):
        return (n for n in range(1, gridSize + 1) if self.isValid(i, n))

    # -------------------------------- valiation -------------------------------
    def isValidRow(self, i, n):
        for rI in self.getRowIdxs(i):
            if self.solution[rI] == n:
                return False

        return True

    def isValidCol(self, i, n):
        for cI in self.getColIdxs(i):
            if self.solution[cI] == n:
                return False

        return True

    def isValidBlock(self, i, n):
        for bI in self.getBlockIdxs(i):
            if self.solution[bI] == n:
                return False

        return True

    def isValid(self, i, n):
        return self.isValidRow(i, n) and self.isValidCol(i, n) and self.isValidBlock(i, n)

    # ---------------------------------- fill ----------------------------------
    def fillDiagonal(self):
        blocks = map(self.getBlockIdxs, [0, 30, 60])

        for block in blocks:
            nums = self.randomNums()

            for i in block:
                self.solution[i] = nums.pop()

    def fillCell(self, i):
        # end of the grid
        if i == gridLength:
            return True

        # pre-filled
        if (self.solution[i]):
            return self.fillCell(i + 1)

        for n in self.getValidValues(i):
            self.solution[i] = n

            if self.fillCell(i + 1):
                return True

        self.solution[i] = 0
        return False

    def fill(self):
        self.solution = [0] * gridLength
        self.fillDiagonal()
        self.fillCell(0)


if __name__ == '__main__':
    t = time()
    s = Sudoku()

    # s.print()

    for i in range(1000):
        s.create()

    tt = round((time() - t) * 1000)
    print(f'time: {tt}ms')
