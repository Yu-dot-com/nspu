import { useUser } from '../hooks/useUser'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {

    const [activeTab,setActiveTab] = useState("Profile")
    const {data,isLoading} = useUser()

    const alltabs = [
              { label: "Profile" ,path: "/setting"},
              { label: "Manage Category" ,path: "manageCategory"},
              { label: "Manage Department" ,path: "manageDepartment"},
              { label: "Manage User" ,path: "manageUser"},
            ]
    if (isLoading) return null;

    const tabs = data.role==="admin" ? alltabs : alltabs.filter((tab)=> tab.label ==="Profile")

  return (
    <div className='mb-5'>
        <h1 className='m-5 font-extrablod text-3xl'>Settings</h1>
        <div className='flex flex-row justify-start items-start mt-5 w-full'>
            {
                tabs.map((tab)=> (
                    <Link key={tab.label} to={tab.path}>
                    <button  onClick={()=>setActiveTab(tab.label)} className={`border-b-2 p-2 text-sm font-light w-full border-gray-600 ${activeTab===tab.label ? "border-b-2 border-gray-800 font-semibold" : "hover:border-b-2 hover:border-gray-400" }`}>
                        {tab.label}
                    </button>
                    </Link>
                ))
            }
        </div>
    </div>
  )
}

export default NavBar