import { useDepartment } from "../hooks/useDepartment";
import CategoryBar from "../components/categoryBar";
import FileBar from "../components/fileBar";
import React, { useState } from "react";
import DepartmentBar from "../components/DepartmentBar";
import { useUser } from "../hooks/useUser";
import NewFileBox from "../components/NewFileBox";
import { useBox } from "../utils/FileContext";

const Department = () => {
  const {data:Userdata,error:UserError} = useUser();
  if(UserError){
    console.log("Cant fetch")
  }
  const {isOpen,setOpen} = useBox()
  return (
    <div>
      {isOpen && <NewFileBox />}
      <div>
        <h1 className="font-semibold mt-4 text-3xl text-gray-900 flex items-center">
          Your Departmental files
        </h1>
      </div>
      <div className="">
        <FileBar filter={Userdata?.department_id}/>
      </div>
    </div>
  );
};

export default Department;
