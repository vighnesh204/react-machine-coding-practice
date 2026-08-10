import React, { useEffect, useRef, useState } from "react";

const UseRefHook = () => {
  const [count, setCount] = useState(0);
  const ref = useRef(0);
  const inputRef = useRef(null);

  useEffect(()=>{
    inputRef.current.focus()
  }, [])
  return (
    <div className="w-full min-h-screen bg-zinc-800 text-white flex items-center justify-center gap-4 flex-col">
      <div className="flex flex-col gap-4 items-center">
        <h4 className="text-xl">{ref.current}</h4>
        <button
          onClick={() => (ref.current += 1)}
          className="px-4 py-2 bg-blue-500 rounded-md font-semibold"
        >
          Increment ref
        </button>
      </div>
      <div className="flex flex-col gap-4 items-center">
        <h4 className="text-xl">{count}</h4>
        <button
          onClick={() => setCount((prev) => prev + 1)}
          className="px-4 py-2 bg-blue-500 rounded-md font-semibold"
        >
          Increment state
        </button>
      </div>
      <div className="flex gap-4">
        <input
          className="px-4 py-2 border rounded-lg"
          type="text"
          ref={inputRef}
        />
      </div>
    </div>
  );
};

export default UseRefHook;
