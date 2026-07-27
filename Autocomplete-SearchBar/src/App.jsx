import React, { useEffect, useState } from "react";

const App = () => {
  const [input, setInput] = useState("");

  const [results, setResults] = useState([]);

  const [showResults, setShowResults] = useState(false);

  const [cache, setCache] = useState({});

  const fetchData = async () => {

    if(cache[input]){
      console.log("CACHE RETURNED ", input)
      setResults(cache[input]);
      return;
    }

    console.log("API CALL ", input)
    const data = await fetch(
      `https://dummyjson.com/products/search?q=${input}`,
    );
    const json = await data.json();
    setResults(json?.products);
    setCache((prev) => ({ ...prev, [input]: json?.products }));
    // console.log(json?.products)
  };

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <div className="flex justify-center mt-20">
      <div className="w-full max-w-xl relative">
        <input
          type="text"
          className="w-full px-5 py-3 border border-gray-300 rounded-full shadow-sm outline-none focus:border-blue-500 focus:ring-blue-200 text-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setShowResults(false)}
        />

        {showResults && (
          <div className="res-container absolute top-16 left-0 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-xl max-h-96 overflow-y-auto z-50">
            {results.map((result) => (
              <span
                key={result.id}
                className="flex items-center gap-3 px-5 py-2 cursor-pointer hover:bg-gray-50 trasition duration-150"
              >
                {result.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
