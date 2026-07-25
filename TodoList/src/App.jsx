import React, { useState } from "react";

const App = () => {
  const [input, setInput] = useState("");

  const [todoList, setTodoList] = useState([]);

  const addTodoItem = () => {
    const item = {
      id: todoList.length + 1,
      text: input,
      isCompleted: false
    }
    setTodoList((prev) => [...prev, item])
    setInput("")
  }

  const toggleCompleted = (id) => {
    setTodoList(todoList.map((item, index) => {
      if(item.id === id){
        return {
          ...item,
          isCompleted: !item.isCompleted
        }
      }
      else{
        return item;
      }
    }))
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex justify-center items-start pt-16 px-4">
      <div className="w-full max-w-lg bg-zinc-800 rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Todo List
        </h1>

        {/* Input Section */}
        <div className="flex gap-3 mb-6">
          <input
            className="flex-1 px-4 py-3 rounded-lg bg-zinc-700 text-white border border-zinc-600 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Enter a task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-white font-medium"
            onClick={() => addTodoItem()}
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        <ul className="space-y-3">
          {todoList.map((item, index) => {
            return (
              <li
                key={item.id}
                className="flex items-center justify-between bg-zinc-700 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.isCompleted}
                    className="w-5 h-5 accent-blue-500 cursor-pointer"
                    onChange={()=> toggleCompleted(item.id)}
                  />

                  <span
                    className={`text-white ${
                      item.isCompleted ? "line-through text-zinc-400" : ""
                    }`}
                  >
                    {item.text || "Sample Todo"}
                  </span>
                </div>

                <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 transition text-white rounded-md text-sm font-medium">
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default App;
