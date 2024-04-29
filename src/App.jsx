import Papa from "papaparse";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import AddTask from "./AddTask";
import "./App.css";
import {
  colorGridCells,
  makeGridForShortestPath,
  shortestPath,
} from "./gridFunctions";
import QrTable from "./QrTable";
import { removeJourney } from "./queueSlice";
const socket = io("http://localhost:3003", {
  transports: ["websocket", "polling", "flashsocket"],
});

function App() {
  const [data, setData] = useState([]);
  const [dims, setDims] = useState({});
  const [sx, setSx] = useState(-1);
  const [sy, setSy] = useState(-1);
  const [dx, setDx] = useState(-1);
  const [dy, setDy] = useState(-1);
  const [sh, setSh] = useState(new Set());
  // const [taskQ,setTaskQ] = useState([])
  const [curr, setCurr] = useState({});
  const val = useSelector((state) => state.tasks).tasks;
  const [currState, setCurrState] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    Papa.parse("/data.csv", {
      download: true,
      complete: (result) => {
        setData(result.data);
        // console.log(result.data);
      },
      header: true,
    });
  }, []);

  useEffect(() => {
    let obj = {
      n: -1,
      m: -1,
    };
    for (let i = 0; i < data.length; i++) {
      //  console.log(data[i]);
      if (obj.n < parseInt(data[i].x)) {
        obj.n = parseInt(data[i].x);
      }
      if (obj.m < parseInt(data[i].y)) {
        obj.m = parseInt(data[i].y);
      }
    }
    setDims(obj);
  }, [data]);

  useEffect(() => {
    socket.on("coordinates", (data) => {
      setCurr(data);
      console.log(data);
    });

    socket.on("end", (_) => {
      dispatch(removeJourney());
      setCurrState(false);
    });
  }, [socket]);

  useEffect(() => {
    //Not Busy
    if (!currState) {
      if (val.length > 0) {
        setCurrState(true);
        console.log(val[0]);
        console.log(val[0].sx, val[0].sy, val[0].dx, val[0].dy);
        setSx(val[0].sx);
        setSy(val[0].sy);
        setDx(val[0].dx);
        setDy(val[0].dy);
        const sp = shortestPath(
          val[0].sx,
          val[0].sy,
          val[0].dx,
          val[0].dy,
          makeGridForShortestPath(
            val[0].sx,
            val[0].sy,
            val[0].dx,
            val[0].dy,
            dims.n + 1,
            dims.m + 1,
            data
          )
        );
        //console.log("s2: ",sp)
        socket.emit("start", sp);
        setSh(
          colorGridCells(
            val[0].sx,
            val[0].sy,
            val[0].dx,
            val[0].dy,
            dims.n + 1,
            dims.m + 1,
            data
          )
        );
      }
    }
  }, [currState]);

  useEffect(() => {
    console.log("change in reduxtk : ", JSON.stringify(val));
    if (!currState) {
      if (val.length > 0) {
        setCurrState(true);
        console.log(val[0]);
        console.log(val[0].sx, val[0].sy, val[0].dx, val[0].dy);
        setSx(val[0].sx);
        setSy(val[0].sy);
        setDx(val[0].dx);
        setDy(val[0].dy);
        const sp = shortestPath(
          val[0].sx,
          val[0].sy,
          val[0].dx,
          val[0].dy,
          makeGridForShortestPath(
            val[0].sx,
            val[0].sy,
            val[0].dx,
            val[0].dy,
            dims.n + 1,
            dims.m + 1,
            data
          )
        );
        //console.log("s2: ",sp)
        socket.emit("start", sp);
        setSh(
          colorGridCells(
            val[0].sx,
            val[0].sy,
            val[0].dx,
            val[0].dy,
            dims.n + 1,
            dims.m + 1,
            data
          )
        );
      }
    }
  }, [val]);

  return (
    <div>
      <QrTable
        n={dims.n + 1}
        m={dims.m + 1}
        data={data}
        sh={sh}
        curr={curr}
        sx={sx}
        sy={sy}
        dx={dx}
        dy={dy}
      />
      {/* <input type="number" value={sx} placeholder="sx" onChange={
        (e) => setSx(parseInt(e.target.value))
      } ></input>
      <input type="number" value={sy} placeholder="sy" onChange={
        (e) => setSy(parseInt(e.target.value))
      } ></input>
      <br /><br />
      <input type="number" value={dx} placeholder="dx" onChange={
        (e) => setDx(parseInt(e.target.value))
      } ></input>
      <input type="number" value={dy} placeholder="dy" onChange={
        (e) => setDy(parseInt(e.target.value))
      }></input> */}
      {/* <br /><br />
      <button onClick={()=> {
        setSh(colorGridCells(sx,sy,dx,dy,dims.n+1,dims.m+1,data))
      }}>Start Travel</button> */}
      <AddTask />
    </div>
  );
}

export default App;
