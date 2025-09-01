import SideBar from '../components/SideBar'
import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './nav'

const Setting = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 bg-bg-color overflow-auto p-4">
        <NavBar/>
        <Outlet />
      </div>
    </div>
  )
}

export default Setting