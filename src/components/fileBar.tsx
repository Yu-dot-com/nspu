import supabase from "../database/supabase_client";
import { useFile } from "../hooks/useFile";
import React, { useEffect, useState, useRef } from "react";
import { PiFile } from "react-icons/pi";
import { RiStarFill } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import { useSearch } from "../utils/SearchContext";
import { useUser } from "../hooks/useUser";
import CustomAlert from "./CustomAlert";
import SkeletonItem from "./SkeletonLoader";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type fileBarProps = {
  id: string;
  name: string;
  path: string;
  size: number;
  duedate: string;
  status: boolean;
  important: boolean;
  filetype: string;
  visible: boolean;
  category_id: string;
  sender: string;
  receiver: string;
  department_ids: string;
  inboxoroutbox: "inbox" | "outbox";
};

type filterProps = {
  filter?: string;
  isImportant?: boolean;
  isHidden?: boolean;
};

const FileBar = ({ filter, isImportant, isHidden }: filterProps) => {
  const { data: AllFIles, isLoading, error, refetch } = useFile();
  const { search } = useSearch();
  const { data: CurrentUser } = useUser();
  const searchTerm = search.name.toLowerCase();

  const [date, setDate] = useState("");
  const [done, setDone] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [noti, setNoti] = useState(false);
  const [message, Setmessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!AllFIles) return;

    const elements = containerRef.current?.querySelectorAll(".file-item");
    if (!elements) return;

    gsap.fromTo(
      elements,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          toggleActions: "play none none none",
        },
      }
    );
  }, [AllFIles]);

  if (isLoading) {
    return (
      <div>
        {[...Array(4)].map((_, i) => (
          <SkeletonItem key={i} />
        ))}
      </div>
    );
  }

  if (error) return <p className="text-red-500">Failed to load files</p>;

  const keyword = filter?.toLowerCase();

  const filteredFiles = AllFIles?.filter((f) => {
    if (!keyword || keyword === "all") return true;
    if (keyword === "inbox") return f.inboxoroutbox === "inbox";
    if (keyword === "outbox") return f.inboxoroutbox === "outbox";
    if (keyword === "school") return f.inboxoroutbox === "school";
    return f.department_ids?.includes(keyword) || f.category_id === keyword;
  })
    .filter((f) => !searchTerm || f.name.toLowerCase().includes(searchTerm))
    .filter((f) => !date || f.duedate?.split("T")[0] === date)
    .filter((f) => !isImportant || f.important)
    .filter((f) => (isHidden ? f.visible === false : f.visible === true));

  const handleDownload = async (path: string) => {
    const { data, error } = await supabase.storage
      .from("userfile")
      .createSignedUrl(path, 120);
    if (error) {
      console.error("Download error:", error);
      alert("Failed to get file URL: " + error.message);
      return;
    }

    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  };

  const handleDelete = async (id: string, path: string) => {
    const { error: bucketError } = await supabase.storage
      .from("userfile")
      .remove([path]);
    if (bucketError) {
      Setmessage("Something went wrong on file deleting");
      setShowAlert(true);
      console.error(bucketError);
      return;
    }

    const { error: fileError } = await supabase
      .from("files")
      .delete()
      .eq("id", id);
    if (fileError) {
      Setmessage("Something went wrong on file deleting");
      setShowAlert(true);
      console.error(fileError);
      return;
    }

    Setmessage("File deleted successfully");
    setShowAlert(true);
    refetch();
  };

  const handleImportant = async (id: string, curr: boolean) => {
    try {
      const { error: importantError } = await supabase
        .from("files")
        .update({ important: !curr })
        .eq("id", id)
        .select();
      if (importantError) {
        Setmessage("Error updating");
        setShowAlert(true);
        return;
      }
    } catch (error) {
      Setmessage("Something went wrong");
      setShowAlert(true);
      return;
    }
    refetch();
  };

  const handleStatus = async (id: string, curr: boolean) => {
    try {
      setDone(true);
      const { error: statusError } = await supabase
        .from("files")
        .update({ status: !curr })
        .eq("id", id);
      if (statusError) {
        Setmessage("Error updating");
        setShowAlert(true);
        return;
      }
      refetch();
    } catch (error) {
      Setmessage("Something went wrong on file deleting");
      setShowAlert(true);
      return;
    }
    setDone(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleNoti = async (id: any, userId: any) => {
    console.log(id, userId, noti);
  };

  return (
    <div>
      {/* Search bar */}
      <div className="flex flex-row justify-end gap-2 mb-2">
        <h1 className="font-semibold text-sm flex items-center text-text">
          Search By Date -{" "}
        </h1>
        <input
          onChange={handleDateChange}
          type="date"
          className="bg-text text-white rounded-md p-1"
        />
      </div>

      {/* File list */}
      <div ref={containerRef} className="mt-2">
        {filteredFiles.length === 0 ? (
          <h1 className="text-black text-center mt-10">No results found</h1>
        ) : (
          filteredFiles.map((n: fileBarProps) => (
            <Link key={n.id} to={`/detail/${n.id}`}>
              <div className="file-item flex flex-row m-2 border-b-2 border-card text-gray-200 hover:shadow-lg p-2 justify-between">
                <div>
                  <div className="flex flex-row justify-center items-center">
                    <PiFile className="mt-1 me-1 text-black" />
                    <h1 className="text-black">{n.name}</h1>
                    <RiStarFill
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleImportant(n.id, !!n.important);
                      }}
                      className={`ms-2 cursor-pointer text-xl ${
                        n.important ? "text-yellow-400" : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-800 ms-6">
                      {(n.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-end items-end gap-2">
                  <div className="flex flex-row gap-3 relative">
                    <h1 className="text-sm text-red-900">
                      Due: {n.duedate ? n.duedate.split("T")[0] : "None"}
                    </h1>

                    <div>
                      <CiMenuKebab
                        onClick={() => {
                          setOpenMenuId(openMenuId === n.id ? null : n.id);
                        }}
                        className="cursor-pointer"
                      />
                      {openMenuId === n.id && (
                        <div className="absolute right-0 bg-gray-300 mt-2 w-32 rounded-md shadow-lg z-10">
                          <button
                            onClick={() => {
                              handleNoti(n.id, CurrentUser?.id);
                              setNoti(!noti);
                            }}
                            className="w-full text-left px-4 py-2 text-gray-700 rounded-md hover:bg-gray-400"
                          >
                            {noti ? "Notify" : "Turn On Noti"}
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(n.id, n.path);
                            }}
                            className="w-full text-left px-4 py-2 text-gray-700 rounded-md hover:bg-gray-400"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row gap-5">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleStatus(n.id, n.status);
                      }}
                      className="w-fit flex flex-row justify-end items-end border-2 border-bg-button rounded-full text-sm text-text hover:bg-gray-200 px-2 py-1 hover:text-black"
                    >
                      {n.status ? "Done " : "Mark As Done"}
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDownload(n.path);
                      }}
                      className="w-fit flex flex-row justify-end items-end bg-green rounded-full text-sm text-white hover:bg-gray-200 px-2 py-1 hover:text-black"
                    >
                      Download
                    </button>

                    {CurrentUser?.role === "admin" && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(n.id, n.path);
                        }}
                      >
                        <MdDeleteOutline className="hover:bg-gray-300 hover:text-black hover:rounded-full text-2xl text-text" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {showAlert && (
        <CustomAlert
          message={message}
          onClose={() => {
            setShowAlert(false);
            Setmessage("");
          }}
        />
      )}
    </div>
  );
};

export default FileBar;
