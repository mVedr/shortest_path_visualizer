import Papa from "papaparse";
import { useEffect, useState } from "react";
import "./App.css";
import QrTable from "./QrTable";
import { colorGridCells } from "./gridFunctions";

function App() {
  const [data, setData] = useState([]);
  const [dims, setDims] = useState({});
  const [sx,setSx] = useState(-1)
  const [sy,setSy] = useState(-1)
  const [dx,setDx] = useState(-1)
  const [dy,setDy] = useState(-1)
  const [sh, setSh] = useState(new Set())
 // const [taskQ,setTaskQ] = useState([])

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

  useEffect(()=>{
    console.log(sh)
  },[sh])

  return (
    <div>
      <QrTable n={dims.n+1} m={dims.m+1} data={data} sh={sh} />
      <input type="number" value={sx} placeholder="sx" onChange={
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
      }></input>
      <br /><br />
      <button onClick={()=> {
        setSh(colorGridCells(sx,sy,dx,dy,dims.n+1,dims.m+1,data))
      }}>Start Travel</button>
    </div>
  );
}

export default App;
