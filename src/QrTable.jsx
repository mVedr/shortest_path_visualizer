import React from 'react';

function QrTable({ n, m,data,sh }) {
  const renderTable = () => {
    const rows = [];
    for (let i = 0; i < n; i++) {
      const cells = [];
      for (let j = 0; j < m; j++) {
        let pos = n*i + j
        if (data[pos].obstacle==='0'){
            if (sh.has(`${i},${j}`)){
                cells.push(<td key={j} style={{"backgroundColor":"green"}}>{data[pos].tag}</td>);
            }else{  
                cells.push(<td key={j}>{data[pos].tag}</td>);
            }
            
        }else{
            cells.push(<td key={j} style={{"backgroundColor":"red"}}>{data[pos].tag}</td>);
        }  
      }
      rows.push(<tr key={i}>{cells}</tr>);
    }
    return rows;
  };

  return (
    <div>
      <table border="1">
        <tbody>
          {renderTable()}
        </tbody>
      </table>
    </div>
  );
}


export default QrTable