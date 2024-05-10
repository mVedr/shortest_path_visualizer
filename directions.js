const path = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 1, y: 2 },
  { x: 2, y: 2 },
];

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

let ans = directions(path,0)

console.log("directions: ",ans[0])
console.log("forwards: ",ans[1])