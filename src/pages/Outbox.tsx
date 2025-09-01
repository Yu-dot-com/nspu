import { useBox } from "../utils/FileContext";
import FileBar from "../components/fileBar";
import React, { useState } from "react";
import NewFileBox from "../components/NewFileBox";

const OutBox = () => {
  const [filter,setfilter] = useState("outbox")
  const {isOpen,setOpen} = useBox()
  return (
    <div>
      {isOpen && <NewFileBox />}
      <div>
        <button onClick={()=>setfilter("outbox")} className="font-semibold mt-4 text-3xl text-gray-900 flex items-center">
          OUTBOX
        </button>
      </div>
      <FileBar filter={"outbox"}/>
    </div>
  );
};

export default OutBox;
