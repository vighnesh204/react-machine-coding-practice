import axios from "axios";
import React, { useEffect, useState } from "react";

const App = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // const fetchData = () => {
  //   axios.get("/api/data").then((response) => {
  //     console.log(response.data);
  //     setData(response.data);
  //   });
  // };
  useEffect(() => {
    (async () => {
     try {
      setError(false);
      setLoading(true);
       const response = await axios.get("/api/data");
      console.log(response.data);
      setData(response.data);
      setLoading(false);
     } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
      setLoading(false);
     }
    })();
    // fetchData();
  }, []);

  // if (error) {
  //   return <div className="w-full min-h-screen bg-zinc-800 p-4 mx-auto text-white">Error fetching data</div>;
  // }

  // if (loading) {
  //   return <div className="w-full min-h-screen bg-zinc-800 p-4 mx-auto text-white">Loading...</div>;
  // }

return (
    <div className="w-full min-h-screen bg-zinc-800 p-4 mx-auto text-white">
      {error ? (
        <div>Error fetching data</div>
      ) : loading ? (
        <div>Loading...</div>
      ) : (
        <nav>
          <h4>Number of Anime : {data.length}</h4>
        </nav>
      )}
    </div>
  );
};

export default App;
