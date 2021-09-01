package main

import (
	"fmt"
	"math/rand"
	"strings"
	"time"
)

const (
	blockSize  = 3
	gridSize   = 9
	gridLength = 81
)

type Sudoku struct {
	solution [gridLength]byte
}

func (s *Sudoku) create() {
	rand.Seed(time.Now().UnixNano())
	s.fill()
}

func (s *Sudoku) print() {
	N := 23
	str := strings.Repeat("─", N/blockSize)

	fmt.Printf("┌%[1]s┬%[1]s┬%[1]s┐\n", str)

	for i := 0; i < gridSize; i += 1 {
		n := i * gridSize

		fmt.Println(
			"│",
			strings.Trim(strings.Replace(fmt.Sprint(s.solution[0+n:3+n]), " ", " ", -1), "[]"),
			"│",
			strings.Trim(strings.Replace(fmt.Sprint(s.solution[3+n:6+n]), " ", " ", -1), "[]"),
			"│",
			strings.Trim(strings.Replace(fmt.Sprint(s.solution[6+n:9+n]), " ", " ", -1), "[]"),
			"│",
		)

		if i == 2 || i == 5 {
			fmt.Printf("├%[1]s┼%[1]s┼%[1]s┤\n", str)
		}
	}

	fmt.Printf("└%[1]s┴%[1]s┴%[1]s┘\n", str)
}

/* ---------------------------------- utils --------------------------------- */
func randomNums() [9]byte {
	// return [9]byte{5, 4, 3, 8, 9, 7, 2, 1, 6}
	a := [9]byte{1, 2, 3, 4, 5, 6, 7, 8, 9}

	rand.Shuffle(len(a), func(i, j int) { a[i], a[j] = a[j], a[i] })

	return a
}

func getIndex(row, col int) int {
	return row*gridSize + col
}

func getRowIdxs(i int) [9]int {
	row := i / gridSize

	idxs := [9]int{}
	for col := 0; col < gridSize; col += 1 {
		idxs[col] = getIndex(row, col)
	}

	return idxs
}

func getColIdxs(i int) [9]int {
	col := i % gridSize

	idxs := [9]int{}
	for row := 0; row < gridSize; row += 1 {
		idxs[row] = getIndex(row, col)
	}

	return idxs
}

func getBlockIdxs(i int) [9]int {
	rowI := i / gridSize
	colI := i % gridSize
	rowStart := rowI / blockSize * blockSize
	colStart := colI / blockSize * blockSize
	rowEnd := rowStart + blockSize
	colEnd := colStart + blockSize

	idxs := [9]int{}
	j := 0
	for row := rowStart; row < rowEnd; row += 1 {
		for col := colStart; col < colEnd; col += 1 {
			idxs[j] = getIndex(row, col)
			j += 1
		}
	}

	return idxs
}

func (s *Sudoku) getValidValues(i int) []byte {
	nums := make([]byte, 0, 9)

	for n := byte(1); n <= gridSize; n += 1 {
		if s.isValid(i, n) {
			nums = append(nums, n)
		}
	}

	return nums
}

/* -------------------------------- valiation ------------------------------- */
func (s *Sudoku) isValidRow(i int, n byte) bool {
	for _, rI := range getRowIdxs(i) {
		if s.solution[rI] == n {
			return false
		}
	}

	return true
}

func (s *Sudoku) isValidCol(i int, n byte) bool {
	for _, cI := range getColIdxs(i) {
		if s.solution[cI] == n {
			return false
		}
	}

	return true
}

func (s *Sudoku) isValidBlock(i int, n byte) bool {
	for _, bI := range getBlockIdxs(i) {
		if s.solution[bI] == n {
			return false
		}
	}

	return true
}

func (s *Sudoku) isValid(i int, n byte) bool {
	return s.isValidRow(i, n) && s.isValidCol(i, n) && s.isValidBlock(i, n)
}

/* ---------------------------------- fill ---------------------------------- */
func (s *Sudoku) fillDiagonal() {
	blocks := [3][9]int{getBlockIdxs(0), getBlockIdxs(30), getBlockIdxs(60)}

	for _, block := range blocks {
		nums := randomNums()

		j := len(nums) - 1
		for _, i := range block {
			s.solution[i] = nums[j]
			j -= 1
		}
	}
}

func (s *Sudoku) fillCell(i int) bool {
	// end of the grid
	if i == gridLength {
		return true
	}

	// pre-filled
	if s.solution[i] != 0 {
		return s.fillCell(i + 1)
	}

	for _, n := range s.getValidValues(i) {
		s.solution[i] = n

		if s.fillCell(i + 1) {
			return true
		}
	}

	s.solution[i] = 0
	return false
}

func (s *Sudoku) fill() {
	s.solution = [gridLength]byte{}
	s.fillDiagonal()
	s.fillCell(0)
}

/* ---------------------------------- clean --------------------------------- */

func main() {
	t := time.Now()
	s := Sudoku{}

	s.create()
	// s.print()

	for i := 0; i < 1000; i += 1 {
		s.create()
	}

	fmt.Printf("time: %dms\n", time.Since(t).Milliseconds())
}
