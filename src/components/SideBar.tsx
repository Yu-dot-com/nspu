import React, { useEffect, useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { LuFolderClosed } from "react-icons/lu";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { TiTags } from "react-icons/ti";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { FaRegFileLines, FaSchool } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { CiInboxIn, CiInboxOut } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useBox } from "../utils/FileContext";
import { logout } from "../database/Logout";
import { useUser } from "../hooks/useUser";
import gsap from "gsap";

type IconType = React.FC<React.SVGProps<SVGSVGElement>>;

const SideBar = () => {
  const { isOpen, setOpen } = useBox();
  const { data: CurrentUser } = useUser();
  const navigate = useNavigate();

  const sidebarRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<HTMLDivElement[]>([]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinks = [
    { icon: HiOutlineOfficeBuilding as IconType, label: "Dashboard", path: "/department" },
    { icon: LuFolderClosed as IconType, label: "Department", path: "/" },
    { icon: CiInboxIn as IconType, label: "Inbox", path: "/inbox" },
    { icon: CiInboxOut as IconType, label: "Outbox", path: "/outbox" },
    { icon: FaSchool as IconType, label: "School", path: "/school" },
    { icon: TiTags as IconType, label: "Important", path: "/tags" },
    { icon: IoSettingsOutline as IconType, label: "Settings", path: "/setting" },
  ];

  const filteredLinks = navLinks.filter(
    (link) => !(CurrentUser?.role === "user" && link.label === "Dashboard")
  );

  // Callback ref to store multiple refs safely
  const addToNavRefs = (el: HTMLDivElement | null) => {
    if (el && !navItemRefs.current.includes(el)) {
      navItemRefs.current.push(el);
    }
  };

  // GSAP animation
  useEffect(() => {
    if (sidebarRef.current) {
      // Slide sidebar in
      gsap.fromTo(
        sidebarRef.current,
        { x: -300, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );

      // Stagger nav items
      gsap.fromTo(
        navItemRefs.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, delay: 0.3, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <div
      ref={sidebarRef}
      className="hidden lgapp:flex bg-text w-[250px] h-full flex-col items-start p-4"
    >
      {/* User Profile Section */}
      <div className="flex items-center gap-3 text-white mt-4 mb-8">
        <CgProfile className="text-3xl" />
        <div className="flex flex-col">
          <span className="text-lg font-semibold">{CurrentUser?.name || "User"}</span>
          <span className="text-xs opacity-80">{CurrentUser?.email || ""}</span>
        </div>
      </div>

      {/* New File (Admins Only) */}
      {CurrentUser?.role === "admin" && (
        <div
          onClick={() => setOpen(true)}
          className="bg-text hover:bg-bg-button rounded-lg w-full mb-6 p-3 cursor-pointer"
          ref={addToNavRefs}
        >
          <div className="flex justify-between items-center text-white">
            <FaRegFileLines className="text-xl" />
            <FiPlus className="text-xl" />
          </div>
          <p className="text-white mt-2 text-sm">New File</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-col gap-4 w-full">
        {filteredLinks.map(({ icon: Icon, label, path }) => (
          <Link key={label} to={path}>
            <div
              className="flex items-center gap-3 text-white hover:bg-bg-button p-2 rounded-md cursor-pointer"
              ref={addToNavRefs}
            >
              <Icon className="text-xl" />
              <span className="font-medium">{label}</span>
            </div>
          </Link>
        ))}
        <div
          onClick={handleLogout}
          className="flex items-center gap-3 text-white hover:bg-bg-button p-2 rounded-md cursor-pointer"
          ref={addToNavRefs}
        >
          <IoLogOutOutline className="text-xl" />
          <span className="font-medium">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
