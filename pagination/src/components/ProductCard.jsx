const ProductCard = ({ item }) => {
  return (
    <div className="w-52 bg-zinc-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:scale-105 duration-300">
      <div className="w-full">
        <img
          className="w-full object-cover"
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

export default ProductCard;