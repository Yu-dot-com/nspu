import { useBox } from '../utils/FileContext';
import CategoryBar from '../components/categoryBar';
import Nav from '../components/Nav'
import React, { useState } from 'react'
import { TbFileSearch } from "react-icons/tb";
import NewFileBox from '../components/NewFileBox';
import DepartmentBar from '../components/DepartmentBar';

const File = () => {
  const { isOpen, setOpen } = useBox();
  return (
    <div>
      {isOpen && <NewFileBox />}
      <div className=''>
        <h1 className='font-semibold mt-4 text-2xl text-gray-900 flex items-center'>Admin Dashboard</h1>

      </div>
      <div>
        <DepartmentBar/>
      </div>

    </div>
  )
}

export default File