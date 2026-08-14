import React, { useReducer } from "react";

const UseReducerHook = () => {
  const countReducer = (state, action) => {
    switch (action.type) {
      case "INCREMENT":
        return {
          ...state,
          count: state.count + 1,
        };

      case "DECREMENT":
        return {
          ...state,
          count: state.count - 1,
        };

      default:
        return state;
    }
  };

  const initialState = {
    count: 0,
  };

  const [state, dispatch] = useReducer(countReducer, initialState);
  return (
    <div className="w-full min-h-screen bg-zinc-800 p-4 mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Count: {state.count}</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        onClick={() => dispatch({ type: "INCREMENT" })} // agr tumhe custom number pass karna hai to use payload, you can do it like this: dispatch({ type: "INCREMENT", payload: 1 })
      >
        Increment
      </button>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => dispatch({ type: "DECREMENT" })}
      >
        Decrement
      </button>
      <ShoppingCart />
    </div>
  );
};

export default UseReducerHook;

const ShoppingCart = () => {
  const products = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" }
  ]
  const initialState = {
    cart: []
  }

  const cartReducer = (state, action) => {
    switch (action.type) {
      case "ADD_TO_CART": 
        return {
          ...state,
          cart: [...state.cart, action.payload]
        }
      case "REMOVE_FROM_CART":
        return {  
          ...state,
          cart: state.cart.filter(item => item.id !== action.payload.id)
        }
        case "CLEAR_CART":
          return {
            ...state,
            cart: []
          }
          default:
            return state;
    }
  }

  const [state, dispatch] = useReducer(cartReducer, initialState)
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
     {products.map(product => (
        <div key={product.id} className="flex justify-between items-center mb-2">
          {product.name}
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={() => dispatch({ type: "ADD_TO_CART", payload: product })}
          >
            Add to Cart
          </button>
        </div>
      ))}
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => dispatch({ type: "CLEAR_CART" })}
      >
        Clear Cart
      </button>
      <ul className="mt-4">
        {state.cart.map(item => (
          <li key={item.id} className="flex justify-between items-center mb-2">
            {item.name}
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item })}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// import { useReducer } from "react";

// const ShoppingCart = () => {
//   const products = [
//     { id: 1, name: "Item 1" },
//     { id: 2, name: "Item 2" },
//     { id: 3, name: "Item 3" }
//   ];

//   const initialState = {
//     cart: []
//   };

//   const cartReducer = (state, action) => {
//     switch (action.type) {
//       case "ADD_TO_CART": {
//         // Har cart entry ko ek unique cartItemId do, product id se alag
//         const newItem = {
//           ...action.payload,
//           cartItemId: `${action.payload.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
//         };
//         return {
//           ...state,
//           cart: [...state.cart, newItem]
//         };
//       }
//       case "REMOVE_FROM_CART":
//         // Ab filter cartItemId se hoga, isliye sirf wahi ek instance remove hoga
//         return {
//           ...state,
//           cart: state.cart.filter(item => item.cartItemId !== action.payload.cartItemId)
//         };
//       case "CLEAR_CART":
//         return {
//           ...state,
//           cart: []
//         };
//       default:
//         return state;
//     }
//   };

//   const [state, dispatch] = useReducer(cartReducer, initialState);

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
//       {products.map(product => (
//         <div key={product.id} className="flex justify-between items-center mb-2">
//           {product.name}
//           <button
//             className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
//             onClick={() => dispatch({ type: "ADD_TO_CART", payload: product })}
//           >
//             Add to Cart
//           </button>
//         </div>
//       ))}

//       <button
//         className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//         onClick={() => dispatch({ type: "CLEAR_CART" })}
//       >
//         Clear Cart
//       </button>

//       <ul className="mt-4">
//         {state.cart.map(item => (
//           // key ab cartItemId hai, product id nahi — isse React bhi har entry ko sahi track karega
//           <li key={item.cartItemId} className="flex justify-between items-center mb-2">
//             {item.name}
//             <button
//               className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
//               onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item })}
//             >
//               Remove
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ShoppingCart;