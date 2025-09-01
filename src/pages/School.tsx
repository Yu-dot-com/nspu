import { useBox } from "../utils/FileContext";
import FileBar from "../components/fileBar";
import React, { useState } from "react";
import NewFileBox from "../components/NewFileBox";

const OutBox = () => {
  const [filter,setfilter] = useState("school")
  const {isOpen,setOpen} = useBox()
  return (
    <div>
      {isOpen && <NewFileBox />}
      <div>
        <button onClick={()=>setfilter(null)} className="font-semibold mt-4 text-3xl text-gray-900 flex items-center">
          School
        </button>
      </div>
      <FileBar filter={"school"}/>
    </div>
  );
};

export default OutBox;
