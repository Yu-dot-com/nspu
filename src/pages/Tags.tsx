import NewFileBox from '../components/NewFileBox';
import FileBar from '../components/fileBar'
import React, { useState } from 'react'
import { useBox } from '../utils/FileContext';

const Tags = () => {

  const [isImportant, setIsImportant] = useState<boolean>(true);
  const {isOpen,setOpen} = useBox()

  return (
    <div>
      {isOpen && <NewFileBox />}
        <div>
        <button onClick={()=> setIsImportant(isImportant)} className='font-semibold mt-4 text-3xl text-gray-900 flex items-center'>TAGS</button>
      </div>
        <FileBar isImportant={isImportant}/>
    </div>
    
  )
}

export default Tags