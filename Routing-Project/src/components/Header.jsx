import React from 'react'
import { NavLink } from 'react-router-dom'

const Header = () => {
  return (
    <header className='flex items-center p-4 h-10 w-full bg-zinc-300 shadow-md space-x-4'>
        <NavLink className='font-semibold' to="/" end>Home</NavLink>
        <NavLink className='font-semibold' to="/posts">Posts</NavLink>
    </header>
  )
}

export default Header
// const Header = () => {
//   return (
//     <header className='flex items-center p-4 h-10 w-full bg-zinc-300 shadow-md space-x-4'>
//       <NavLink
//         to="/"
//         end
//         className={({ isActive }) =>
//           `font-semibold ${isActive ? "text-blue-500" : ""}`
//         }
//       >
//         Home
//       </NavLink>
//       <NavLink
//         to="/posts"
//         className={({ isActive }) =>
//           `font-semibold ${isActive ? "text-blue-500" : ""}`
//         }
//       >
//         Posts
//       </NavLink>
//     </header>
//   )
// }