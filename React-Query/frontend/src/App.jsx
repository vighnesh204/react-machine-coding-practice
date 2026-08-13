import CustomReactQuery from "./hooks/customReactQuery";
const App = () => {

  const [data, error, loading] = CustomReactQuery("/api/data");

  // const fetchData = () => {
  //   axios.get("/api/data").then((response) => {
  //     console.log(response.data);
  //     setData(response.data);
  //   });
  // };


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
