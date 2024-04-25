import React, { useEffect } from "react";

function QrTable({sx,sy, dx, dy, n, m, data, sh, curr }) {
  useEffect(() => {
    console.log("table curr ", curr);
  }, [curr]);

  const renderTable = () => {
    const rows = [];
    for (let i = 0; i < n; i++) {
      const cells = [];
      for (let j = 0; j < m; j++) {
        let pos = n * i + j;
        if (data[pos].obstacle === "0") {
          if (curr.x === i && curr.y === j) {
            cells.push(
              <td key={j} style={{ backgroundColor: "green" }}>
                {data[pos].tag} <b>*</b>
              </td>
            );
          } else if ((i == dx && j == dy)||(i== sx && j==sy)) {
            if (curr.x === i && curr.y === j) {
              cells.push(
                <td key={j} style={{ backgroundColor: "blue" }}>
                  {data[pos].tag} <b>*</b>
                </td>
              );
            } else {
              cells.push(
                <td key={j} style={{ backgroundColor: "blue" }}>
                  {data[pos].tag}{" "}
                </td>
              );
            }
          } else if (sh.has(`${i},${j}`)) {
            cells.push(
              <td key={j} style={{ backgroundColor: "green" }}>
                {data[pos].tag}{" "}
              </td>
            );
          } else {
            cells.push(
              <td key={j}>
                {data[pos].tag} {curr.x == i && curr.y == j && <b>*</b>}
              </td>
            );
          }
        } else {
          if ((i == dx && j == dy)||(i== sx && j==sy)) {
            if (curr.x === i && curr.y === j) {
              cells.push(
                <td key={j} style={{ backgroundColor: "blue" }}>
                  {data[pos].tag} <b>*</b>
                </td>
              );
            } else {
              cells.push(
                <td key={j} style={{ backgroundColor: "blue" }}>
                  {data[pos].tag}{" "}
                </td>
              );
            }
          } else {
            cells.push(
              <td key={j} style={{ backgroundColor: "red" }}>
                {data[pos].tag}
              </td>
            );
          }
        }
      }
      rows.push(<tr key={i}>{cells}</tr>);
    }
    return rows;
  };

  return (
    <div>
      <table border="1">
        <tbody>{renderTable()}</tbody>
      </table>
    </div>
  );
}

export default QrTable;
