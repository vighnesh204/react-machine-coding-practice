import React from 'react'
import { useTheme } from '../context/ThemeContext'

const Blog = () => {
  const { theme } = useTheme()

  return (
    <div
      className={
        theme === 'dark'
          ? 'rounded-lg bg-gray-800 p-6 text-white'
          : 'rounded-lg bg-white p-6 text-gray-900 shadow'
      }
    >
      <h1 className='text-3xl font-bold underline'>Blog</h1>
      <p className='mt-3 text-lg font-semibold'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
      </p>
    </div>
  )
}

export default Blog