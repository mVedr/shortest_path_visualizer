export  function makeGridForShortestPath(n,m,data){
    let grid = new Array(n)
    let vis = new Array(n)

    for (let i=0;i<n;i++){
        grid[i] = []
        vis[i] = []
    }

    for (let i=0;i<n;i++){
        for (let j=0;j<m;j++){
            vis[i][j] = false
            if (data[n*i+j].obstacle==='1'){
                grid[i][j] = 1
            }else{
                grid[i][j] = 0
            }
        }
    }
    return grid
}



export function shortestPath(sx, sy, dx, dy, grid) {
    const xd = [1, -1, 0, 0];
    const yd = [0, 0, 1, -1];

    const n = grid.length;
    const m = grid[0].length;
    const vis = new Array(n).fill(null).map(() => new Array(m).fill(false));
    const prev = new Map();
    const q = [{ x: sx, y: sy }];
    prev[`${sx},${sy}`] = { x: -1, y: -1 };
    vis[sx][sy] = true;
  
    while (q.length > 0) {
        const tp = q.shift();
        if (tp.x === dx && tp.y === dy) {
            break;
        }
        for (let k = 0; k < 4; k++) {
            const cx = tp.x + xd[k];
            const cy = tp.y + yd[k];
            if (cx >= 0 && cx < n && cy >= 0 && cy < m && !vis[cx][cy] && grid[cx][cy] === 0) {
                prev[`${cx},${cy}`] = { x: tp.x, y: tp.y };
                vis[cx][cy] = true;
                q.push({ x: cx, y: cy });
            }
        }
    }
  
    const ans = [];
    let curr = { x: dx, y: dy };
    while (curr.x !== -1 && curr.y !== -1) {
        ans.push(curr);
        curr = prev[`${curr.x},${curr.y}`];
    }

    return ans.reverse();
}

// console.log("Hello JavaScript");
// const path = shortestPath(0, 0, 2, 2, [
//     [0, 0, 1],
//     [0, 1, 0],
//     [0, 0, 0]
// ]);
// console.log(path);

//o/p
// Hello JavaScript
// [
//   { x: 0, y: 0 },
//   { x: 1, y: 0 },
//   { x: 2, y: 0 },
//   { x: 2, y: 1 },
//   { x: 2, y: 2 }
// ]

export  function colorGridCells(sx,sy,dx,dy,n,m,data){
    let grid = makeGridForShortestPath(n,m,data)
    return shortestPath(sx,sy,dx,dy,grid)
}