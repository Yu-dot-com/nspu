import supabase from "../database/supabase_client";
import { useFile } from "../hooks/useFile";
import React, { useEffect, useState, useRef } from "react";
import { PiFile } from "react-icons/pi";
import { RiStarFill } from "react-icons/ri";
import {
  MdDeleteOutline,
  MdCancel,
  MdCheckCircle,
  MdDownloadForOffline,
} from "react-icons/md";
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
        duration: 0.3,
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
              <div className="file-item group flex flex-row justify-between items-center m-2 border-b border-card p-2 rounded-sm hover:shadow-md bg-white transition">
                {/* Left: file icon + name */}
                <div className="flex items-center gap-2">
                  <PiFile className="text-black" />
                  <h1 className="text-black font-medium">{n.name}</h1>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2">
                  {/* Default: due date and delete */}
                  <span className="text-sm text-red-900 group-hover:hidden">
                    Due: {n.duedate ? n.duedate.split("T")[0] : "None"}
                  </span>

                  {/* Hover: Mark as Done and Download */}
                  <div className="hidden group-hover:flex gap-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDownload(n.path);
                      }}
                      className="px-2 py-1 text-sm bg-green-500 bg-blue-400 text-white rounded hover:bg-green-600"
                    >
                      <MdDownloadForOffline />
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleStatus(n.id, n.status);
                      }}
                      className="px-2 py-1 text-sm  text-white rounded hover:bg-green-600 "
                    >
                      {n.status ? (
                        <MdCheckCircle className="bg-blue-400" />
                      ) : (
                        <MdCancel className="bg-red-400" />
                      )}
                    </button>

                    <MdDeleteOutline
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(n.id, n.path);
                      }}
                      className="text-red-500 text-xl cursor-pointer "
                    />
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
