import React, { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import { CiLock } from "react-icons/ci";
import { useUser } from "../hooks/useUser";
import { useSearch } from "../utils/SearchContext";
import NotiBar from "./NotiBar";

const Nav = () => {
  const { data } = useUser();
  const [open, isOpen] = useState(false);
  const { search, setsearch } = useSearch();
  const [searchTerm, setsearchTerm] = useState(search.name);
  const name = data?.name?.split(" ")[0];
  const [notiBar,setNotiBar] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setsearch({ ...search, name: searchTerm });
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handlesearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsearchTerm(e.target.value);
  };

  // Function to trigger desktop notification via Electron IPC
  const handleNotifyClick = () => {
    // if (window.electronAPI?.notify) {
    //   alert("yu")
    //   window.electronAPI.notify({
    //     title: "Notification Title",
    //     body: "You clicked the notification icon!",
    //   });
    // } else {
    //   alert("Notification API not available");
    // }
  };

  return (
    <div>
      <div className="mt-2">
        <div>
          <h1 className="font-semibold text-2xl flex flex-row justify-center text-gray-800">NSPU FILE MANAGEMTN SYSTEM</h1>
        </div>
        <div className="w-full flex flex-row mt-2 justify-between">
          <div className="relative flex flex-row w-3/4">
            <IoSearch className="absolute ms-2 mt-2.5 my-1 text-2xl text-bg-button" />
            <input
              type="text"
              placeholder="Search Files"
              value={searchTerm}
              onChange={handlesearchChange}
              className="w-full placeholder:text-bg-button ps-10 h-8 border-2 focus:outline-dashed focus:outline-none border-bg-button  bg-light p-5 rounded-full"
            />
          </div>

          <div className="flex flex-row items-center gap-5">
            {data?.role === "admin" && (
              <button className="p-2 rounded-full hover:bg-white hover:text-blue-600 transition">
              <Link to={"/hidden"}>
                <CiLock className="text-3xl font-light text-text" />
              </Link>
              </button>
            )}
            {/* Add onClick handler to notification icon */}
            <button className="p-2 rounded-full hover:bg-white hover:text-blue-600 transition">
            <MdOutlineNotificationsActive
              onClick={()=>setNotiBar(!notiBar)}
              className="text-3xl font-light cursor-pointer text-text"
              title="Show Notification"
            />
            </button>
            <button className="p-2 rounded-full hover:bg-white hover:text-blue-600 transition">
            <Link to={"/setting"}>
              <FaRegUserCircle className="text-3xl font-light text-text" />
            </Link>
            </button>
          </div>
        </div>
        {
        notiBar && (
          <NotiBar onClose={()=>setNotiBar(!notiBar)}/>
        )
      }
      </div>
      
    </div>
  );
};

export default Nav;
