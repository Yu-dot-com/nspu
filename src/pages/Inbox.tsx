import { useBox } from "../utils/FileContext";
import FileBar from "../components/fileBar";
import React, { useState } from "react";
import NewFileBox from "../components/NewFileBox";

const Inbox = () => {

  const [filter,setfilter] = useState("inbox")
  const {isOpen,setOpen} = useBox()
  return (
    <div>
      {isOpen && <NewFileBox />}
      <div>
        <button onClick={()=>setfilter("inbox")} className="font-semibold mt-4 text-3xl text-gray-900 flex items-center">
          INBOX
        </button>
      </div>
      <FileBar  filter={filter}/>
    </div>
  );
};

export default Inbox;
