import React, { useEffect, useState } from "react";

const Card = ({ item }) => {
  return (
    <div className="w-56 bg-zinc-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:scale-105 duration-300">
      <div className="w-full">
        <img
          className="w-full h-full object-cover"
          src={item.thumbnail}
          alt={item.title}
        />
      </div>

      <div className="p-3">
        <h2 className="text-lg font-semibold">{item.title}</h2>

        <p className="text-sm text-zinc-300 mt-1 line-clamp-2">
          {item.description}
        </p>

        <p className="text-yellow-400 font-bold mt-3">
          ${item.price}
        </p>
      </div>
    </div>
  );
};

const App = () => {
  const [products, setProducts] = useState([]);

  const fetchData = async () => {
    const data = await fetch("https://dummyjson.com/products?limit=250");
    const json = await data.json();
    setProducts(json?.products);
  };

  useEffect(() => {
    fetchData();
  }, []);
return !products.length ? (
  <h2 className="text-center text-2xl font-semibold mt-10 text-white">
    No Products Found
  </h2>
) : (
  <div className="min-h-screen w-full bg-zinc-800 p-6">
    {/* Cards Container */}
    <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6">
      {products.map((item, index) => (
        <Card key={item.id} item={item} index={index} />
      ))}
    </div>
  </div>
);
};

export default App;
