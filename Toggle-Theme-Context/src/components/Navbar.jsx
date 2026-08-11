import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";   // ✅ FIX 1: import add kiya

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
  
     <nav
      className={`flex justify-between items-center p-4 text-white ${
        theme === "dark" ? "bg-gray-900" : "bg-blue-600"
      }`}>
        <h1 className="text-2xl font-bold">My App</h1>

        <ul className="flex space-x-4 items-center">
          <li>
            <Link to="/" className="hover:text-gray-400">Home</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-gray-400">About</Link>
          </li>
          <li>
            <Link to="/blog" className="hover:text-gray-400">Blog</Link>
          </li>

          {/* ✅ FIX 3: toggle button add kiya jo actually context use kare */}
          <li>
            <button
              onClick={toggleTheme}
              className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500"
            >
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </li>
        </ul>
      </nav>

  );
};

export default Navbar;