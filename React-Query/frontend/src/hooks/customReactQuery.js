import axios from "axios";
import { useEffect, useState } from "react";

const CustomReactQuery = (urlPath) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setError(false);
        setLoading(true);
        const response = await axios.get(urlPath);
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
  return [data, error, loading];
};

export default CustomReactQuery;