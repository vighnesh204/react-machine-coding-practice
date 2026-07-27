import React, { useEffect, useState } from "react";
import { PAGE_SIZE } from "./utils/constants";
import ProductCard from "./components/ProductCard";
import Pagination from "./components/Pagination";


const App = () => {
  const [products, setProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);

  const fetchData = async () => {
    const data = await fetch("https://dummyjson.com/products?limit=250");
    const json = await data.json();
    setProducts(json?.products);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalProducts = products.length;
  const noOfPages = Math.ceil(totalProducts / PAGE_SIZE);

  const start = currentPage * PAGE_SIZE;
  const end = start + PAGE_SIZE;


return !products.length ? (
  <h2 className="text-center text-2xl font-semibold mt-10 text-white">
    No Products Found
  </h2>
) : (
  <div className="min-h-screen w-full bg-zinc-800 p-4">
      
        <Pagination currentPage = {currentPage} noOfPages = {noOfPages} setCurrentPage = {setCurrentPage}/>
   
    {/* Cards Container */}
    <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6">
      {products.slice(start,end).map((item, index) => (
        <ProductCard key={item.id} item={item} index={index} />
      ))}
    </div>
  
  </div>
);
};

export default App;
