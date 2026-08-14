import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

const AppLayout = () => {
  return (
    <div>
        {/* header */}
        <Header />
        {/* pages */}
    <Outlet />
    </div>
  )
}

export default AppLayout