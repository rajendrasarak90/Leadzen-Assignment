import React, { useEffect, useState } from "react";
import Papa from "papaparse";

const App = () => {
  const [csvData, setCsvData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/product_data.csv");
        const textData = await response.text();
        console.log(textData);
        const data = parseCSVData(textData);
        setCsvData(data);
      } catch (error) {
        console.error("Error fetching or parsing CSV:", error);
      }
    };

    const parseCSVData = (textData) => {
      // const rows = textData.split("\n");
      // const headers = rows[0].split(",");
      // const rowData = rows.slice(1);
      // const data = rowData.map((row) => {
      //   const values = row.split(",");
      //   const obj = {};
      //   headers.forEach((header, index) => {
      //     obj[header] = values[index];
      //   });
      //   return obj;
      // });
      // return data;
      const parsedData = Papa.parse(textData, {
        header: true, // Treat the first row as header
        skipEmptyLines: true, // Skip empty lines
      });

      return parsedData.data;
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="">
        <h1 className="bg-secondary m-0 p-3 text-white">
          Amazon Product Scraper
        </h1>
        <table className="table table-success table-striped">
          <thead>
            <tr className="fs-5">
              <th className="text-center align-middle">No.</th>
              <th className="text-center align-middle">Product URL</th>
              <th className="text-center align-middle">Product Name</th>
              <th className="text-center align-middle">Product Price</th>
              <th className="text-center align-middle">Rating</th>
            </tr>
          </thead>
          <tbody>
            {csvData.map((product, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{product["Product URL"]}</td>
                <td>{product["Product Name"]}</td>
                <td>{product["Product Price"]}</td>
                <td>{product["Rating"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
};

export default App;
