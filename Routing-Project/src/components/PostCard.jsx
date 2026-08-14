import React from 'react'
import { Link } from 'react-router-dom'

const PostCard = ({ item }) => {
  return (
    <div className='w-full p-4 rounded-lg bg-zinc-800 text-white'>
        <h2 className='text-lg font-semibold mb-4'>{item.title}</h2> 
        <p className='text-sm truncate text-slate-200'>{item.body}</p>
        <div className='flex items-center justify-center p-2'>
          <button className = "w-48 px-6 py-3 bg-blue-500 rounded-lg text-sm font-semibold "><Link  to = {`/posts/${item.id}`}>View Comments</Link></button>
        </div>
    </div>
  )
}

export default PostCard