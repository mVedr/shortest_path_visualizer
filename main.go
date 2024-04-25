package main

import (
	"fmt"
)

var (
	xd = []int{1, -1, 0, 0}
	yd = []int{0, 0, 1, -1}
)

type Cell struct {
	x, y int
}

func shortestPath(sx, sy, dx, dy int, grid [][]int) {
	n, m := len(grid), len(grid[0])
	vis := make([][]bool, n)
	for i := range grid {
		vis[i] = make([]bool, m)
	}
	prev := make(map[Cell]Cell)
	q := []Cell{{x: sx, y: sy}}
	prev[Cell{x: sx, y: sy}] = Cell{x: -1, y: -1}
	vis[sx][sy] = true
	for len(q) > 0 {
		tp := q[0]
		q = q[1:]
		if tp.x == dx && tp.y == dy {
			break
		}
		for k := 0; k < 4; k++ {
			cx, cy := tp.x+xd[k], tp.y+yd[k]
			if cx >= 0 && cx < n && cy >= 0 && cy < m && !vis[cx][cy] && grid[cx][cy] == 0 {
				prev[Cell{x: cx, y: cy}] = Cell{x: tp.x, y: tp.y}
				vis[cx][cy] = true
				q = append(q, Cell{x: cx, y: cy})
			}
		}
	}

	ans := []Cell{}
	curr := Cell{x: dx, y: dy}
	for {
		if curr.x == -1 && curr.y == -1 {
			break
		}
		ans = append(ans, Cell{x: curr.x, y: curr.y})
		curr = prev[curr]
	}

	for i := len(ans) - 1; i >= 0; i-- {
		fmt.Printf("(%d, %d) ", ans[i].x, ans[i].y)
	}
}

func main() {
	fmt.Println("Hello go")
	shortestPath(0, 0, 2, 2, [][]int{
		{0, 0, 1},
		{0, 1, 0},
		{0, 0, 0},
	})
}
