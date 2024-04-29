import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addJourney } from "./queueSlice";
function AddTask() {
  const arr = useSelector((state) => state.tasks).tasks;
  const dispatch = useDispatch();
  const [sx, setSx] = useState(-1);
  const [sy, setSy] = useState(-1);
  const [dx, setDx] = useState(-1);
  const [dy, setDy] = useState(-1);
 // console.log(arr);
  return (
    <div>
      <div>Add Task</div>
      {arr.length > 0 &&
        arr.map((element, index) => (
          <h3 key={index}>{index%2===0 && JSON.stringify(element)}</h3>
        ))}
      <br />
      <input
        type="number"
        value={sx}
        placeholder="sx"
        onChange={(e) => setSx(parseInt(e.target.value))}
      ></input>
      <input
        type="number"
        value={sy}
        placeholder="sy"
        onChange={(e) => setSy(parseInt(e.target.value))}
      ></input>
      <br />
      <br />
      <input
        type="number"
        value={dx}
        placeholder="dx"
        onChange={(e) => setDx(parseInt(e.target.value))}
      ></input>
      <input
        type="number"
        value={dy}
        placeholder="dy"
        onChange={(e) => setDy(parseInt(e.target.value))}
      ></input>
      <br />
      <button
        onClick={() => dispatch(addJourney({ dx: dx, dy: dy, sx: sx, sy: sy }))}
      >
        Add Journey
      </button>
      <br />
    </div>
  );
}

export default AddTask;
