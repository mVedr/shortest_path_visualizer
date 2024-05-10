export function makeGridForShortestPath(sx, sy, dx, dy, n, m, data) {
  let grid = new Array(n);
  let vis = new Array(n);

  for (let i = 0; i < n; i++) {
    grid[i] = [];
    vis[i] = [];
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      vis[i][j] = false;
      if ((i == sx && j == sy) || (i == dx && j == dy)) {
        grid[i][j] = 0;
      } else if (data[n * i + j].obstacle === "1") {
        grid[i][j] = 1;
      } else {
        grid[i][j] = 0;
      }
    }
  }
  return grid;
}

export function shortestPath(sx, sy, dx, dy, grid,currForward) {
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
    const nn = q.length;
    for (let i = 0; i < nn; i++) {
      const tp = q.shift();
      if (tp.x === dx && tp.y === dy) {
        break;
      }
      for (let k = 0; k < 4; k++) {
        const cx = tp.x + xd[k];
        const cy = tp.y + yd[k];
        if (
          cx >= 0 &&
          cx < n &&
          cy >= 0 &&
          cy < m &&
          !vis[cx][cy] &&
          grid[cx][cy] === 0
        ) {
          prev[`${cx},${cy}`] = { x: tp.x, y: tp.y };
          vis[cx][cy] = true;
          q.push({ x: cx, y: cy });
        }
      }
    }
  }

  const ans = [];
  let curr = { x: dx, y: dy };
  while (curr.x !== -1 && curr.y !== -1) {
    ans.push(curr);
    curr = prev[`${curr.x},${curr.y}`];
  }
  const path = ans.reverse();
  const fa = directions(path,currForward)
  for (let i=0;i < path.length;i++){
    if(i==path.length-1){
      path[i].dir = -1
      path[i].fwd = fa[1][i]
    }else{
      path[i].dir = fa[0][i]
      path[i].fwd = fa[1][i]
    }
  }
  return path;
}

const path = shortestPath(0, 0, 2, 2, [
    [0, 0, 1],
    [0, 1, 0],
    [0, 0, 0]
],0);
console.log(path);

// [
//   { x: 0, y: 0 },
//   { x: 1, y: 0 },
//   { x: 2, y: 0 },
//   { x: 2, y: 1 },
//   { x: 2, y: 2 }
// ]

export function colorGridCells(sx, sy, dx, dy, n, m, data) {
  let grid = makeGridForShortestPath(sx, sy, dx, dy, n, m, data);
  let arr = shortestPath(sx, sy, dx, dy, grid);
  let st = new Set();
  for (let i = 0; i < arr.length; i++) {
    st.add(`${arr[i].x},${arr[i].y}`);
  }
  return st;
}

export function directions(path, currForward) {
  // console.log("currForward: ", currForward);
  let dirs = [];
  let fwds = []
  fwds.push(currForward)
  for (let i = 0; i < path.length - 1; i++) {
    // console.log("currForward: ", currForward);
    // console.log("p1: ", path[i], " p2: ", path[i + 1]);
    if (path[i].x > path[i + 1].x) {
      //up
      if (currForward == 0) {
        dirs.push(3);
      } else if (currForward == 1) {
        dirs.push(1);
      } else if (currForward == 2) {
        //go in same direction
        dirs.push(0);
      } else if (currForward == 3) {
        dirs.push(2);
      }
      currForward = 2;
    } else if (path[i].x < path[i + 1].x) {
      //down
      if (currForward == 0) {
        //go in same direction
        dirs.push(0);
      } else if (currForward == 1) {
        dirs.push(2);
      } else if (currForward == 2) {
        dirs.push(3);
      } else if (currForward == 3) {
        dirs.push(1);
      }
      currForward = 0;
    } else if (path[i].y > path[i + 1].y) {
      //left
      if (currForward == 0) {
        dirs.push(2);
      } else if (currForward == 1) {
        dirs.push(3);
      } else if (currForward == 2) {
        dirs.push(1);
      } else if (currForward == 3) {
        //go in same direction
        dirs.push(0);
      }
      currForward = 3;
    } else if (path[i].y < path[i + 1].y) {
      //right
      if (currForward == 0) {
        dirs.push(1);
      } else if (currForward == 1) {
        //go in same direction
        dirs.push(0);
      } else if (currForward == 2) {
        dirs.push(2);
      } else if (currForward == 3) {
        dirs.push(3);
      }
      currForward = 1;
    }
    fwds.push(currForward)
  }
  return [dirs,fwds]
}