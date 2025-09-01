import React, { useEffect, useRef } from "react";
import { useNotiHistory } from "../hooks/useNotiHistory";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { PiFile } from "react-icons/pi";

type NotiBarProps = {
  onClose: () => void;
};

const NotiBar = ({ onClose }: NotiBarProps) => {
  const { data: history, isLoading, error } = useNotiHistory();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Slide in on mount
    gsap.fromTo(
      panelRef.current,
      { x: "100%" }, // Start fully off-screen
      { x: "0%", duration: 0.5, ease: "power3.out" }
    );
  }, []);

  const handleClose = () => {
    // Slide out then trigger onClose
    gsap.to(panelRef.current, {
      x: "100%",
      duration: 0.4,
      ease: "power3.in",
      onComplete: onClose,
    });
  };

  return (
    <div
      ref={panelRef}
      className="fixed top-0 right-0 h-screen w-96 bg-orange-100 shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b bg-bg-button">
        <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
        <IoClose
          onClick={handleClose}
          className="text-2xl cursor-pointer text-gray-600 hover:text-gray-800"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {isLoading && <p className="text-gray-500 text-center">Loading...</p>}
        {error && (
          <p className="text-red-500 text-center">
            Error loading notifications
          </p>
        )}
        {!isLoading && !error && history?.length === 0 && (
          <p className="text-gray-500 text-center">No notifications yet</p>
        )}
        {history
          ?.slice() // create a copy
          .sort((a, b) => b.sent_at.localeCompare(a.sent_at)) // newest first
          .map((item) => (
            <Link
              key={item.id}
              to={`/detail/${item.file_id}`}
              onClick={handleClose}
            >
              <div className="bg-orange-50 p-3 cursor-pointer shadow-sm hover:shadow-md transition">
                <div className="flex flex-row gap-1">
                  <PiFile className="mt-1 me-1 text-black" />
                  <h3 className="font-medium text-gray-800">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{item.body}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {item.sent_at.slice(8, 10) +
                    " " +
                    [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ][parseInt(item.sent_at.slice(5, 7)) - 1] +
                    ", " +
                    item.sent_at.slice(11, 16)}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default NotiBar;
