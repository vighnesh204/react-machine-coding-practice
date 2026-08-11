import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Blog from './pages/Blog'
import Navbar from './components/Navbar'
import { ThemeProvider, useTheme } from './context/ThemeContext'

const AppLayout = () => {
  const { theme } = useTheme()

  return (
    <div
      className={
        theme === 'dark'
          ? 'min-h-screen bg-gray-900 text-white'
          : 'min-h-screen bg-slate-100 text-gray-900'
      }
    >
      <Navbar />

      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </main>
    </div>
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App