from time import time
from random import shuffle

BLOCK_SIZE = 3
GRID_SIZE = 9
GRID_LENGTH = 81


def print_s(puzzle):
    N = 23
    s = '─' * (N // BLOCK_SIZE)

    print(f'┌{s}┬{s}┬{s}┐')

    for i in range(GRID_SIZE):
        n = i * GRID_SIZE

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
    solution = [0] * GRID_LENGTH
    puzzle = [0] * GRID_LENGTH

    def __init__(self):
        self.create()

    def create(self):
        self.clean_grid()
        self.fill_diagonal()
        self.fill_blanks()
        self.random_clean(35)

    # ---------------------------------- utils ---------------------------------
    def random_nums(self):
        return [5, 4, 3, 8, 9, 7, 2, 1, 6]
        # arr = list(range(1, GRID_SIZE + 1))
        # shuffle(arr)

        # return arr

    def get_index(self, row, col):
        return row * GRID_SIZE + col

    def get_row_idxs(self, i):
        row = i // GRID_SIZE

        return (self.get_index(row, col) for col in range(GRID_SIZE))

    def get_col_idxs(self, i):
        col = i % GRID_SIZE

        return (self.get_index(row, col) for row in range(GRID_SIZE))

    def get_block_idxs(self, i):
        row = i // GRID_SIZE
        col = i % GRID_SIZE
        rowStart = row // BLOCK_SIZE * BLOCK_SIZE
        colStart = col // BLOCK_SIZE * BLOCK_SIZE

        return (
            self.get_index(rowStart + r, colStart + c)
            for c in range(3)
            for r in range(3)
        )

    def get_random_indices(self):
        indices = list(range(len(self.puzzle)))
        shuffle(indices)

        return indices

    def get_valid_values(self, i):
        return (n for n in range(1, GRID_SIZE + 1) if self.is_valid(i, n))

    def get_solutions(self, limit, found, start):
        try:
            i = self.puzzle.index(0, start)
        except:
            found.append(self.puzzle[::])

            return found

        for n in self.get_valid_values(i):
            self.puzzle[i] = n

            self.get_solutions(limit, found, i)

            if (len(found) >= limit):
                break

        self.puzzle[i] = 0

        return found

    # -------------------------------- valiation -------------------------------
    def is_valid_row(self, i, n):
        for rI in self.get_row_idxs(i):
            if self.puzzle[rI] == n:
                return False

        return True

    def is_valid_col(self, i, n):
        for cI in self.get_col_idxs(i):
            if self.puzzle[cI] == n:
                return False

        return True

    def is_valid_block(self, i, n):
        for bI in self.get_block_idxs(i):
            if self.puzzle[bI] == n:
                return False

        return True

    def is_valid(self, i, n):
        return self.is_valid_row(i, n) and self.is_valid_col(i, n) and self.is_valid_block(i, n)

    # ---------------------------------- fill ----------------------------------
    def clean_grid(self):
        self.puzzle = [0] * GRID_LENGTH

    def fill_diagonal(self):
        blocks = map(self.get_block_idxs, [0, 30, 60])

        for block in blocks:
            nums = self.random_nums()

            for i in block:
                self.puzzle[i] = nums.pop()

    def fill_blanks(self):
        [solution] = self.get_solutions(1, [], 0)

        self.puzzle = solution

    def random_clean(self, limit):
        self.solution = self.puzzle[::]

        removed = 0
        for i in self.get_random_indices():
            snapshot = self.puzzle[i]

            self.puzzle[i] = 0

            if (len(self.get_solutions(2, [], 0)) > 1):
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
